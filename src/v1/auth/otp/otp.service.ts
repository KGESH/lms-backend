import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { OtpRepository } from '@src/v1/auth/otp/otp.repository';
import { IOtp, IOtpCreate } from '@src/v1/auth/otp/otp.interface';
import { SmsService } from '@src/infra/sms/sms.service';
import { OtpQueryRepository } from '@src/v1/auth/otp/otp-query.repository';
import * as date from '@src/shared/utils/date';
import { UserService } from '@src/v1/user/user.service';
import { generateRandomNumberString } from '@src/shared/helpers/otp';
import { DrizzleService } from '@src/infra/db/drizzle.service';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  constructor(
    private readonly userService: UserService,
    private readonly smsService: SmsService,
    private readonly otpRepository: OtpRepository,
    private readonly otpQueryRepository: OtpQueryRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async verifyOtp(
    params: Pick<IOtp, 'identifier' | 'usage' | 'code'>,
  ): Promise<boolean> {
    const otp = await this.otpQueryRepository.findLatestOtpByIdentifier(params);

    if (!otp) {
      return false;
    }

    if (otp.code !== params.code) {
      return false;
    }

    return otp.expires >= date.now('date');
  }

  async verifySignupOtp({
    code,
    identifier,
  }: Pick<IOtp, 'code' | 'identifier'>): Promise<boolean> {
    const isValid = await this.verifyOtp({ code, identifier, usage: 'signup' });
    return isValid;
  }

  async sendSignupOtp({ phoneNumber }: { phoneNumber: string }): Promise<IOtp> {
    const existUser = await this.userService.findUserByPhoneNumber({
      phoneNumber,
    });

    if (existUser) {
      throw new ConflictException('User already exist.');
    }

    const random6DigitsNumberString = generateRandomNumberString({ digits: 6 });

    const afterOneHour = date.addDate(date.now('date'), 1, 'hour', 'date');

    const otp = await this.sendOtp({
      phoneNumber,
      code: random6DigitsNumberString,
      identifier: phoneNumber,
      usage: 'signup',
      expires: afterOneHour,
    });

    return otp;
  }

  async sendOtp(params: IOtpCreate & { phoneNumber: string }): Promise<IOtp> {
    const existOtp =
      await this.otpQueryRepository.findLatestOtpByIdentifier(params);

    const otp = await this.drizzle.db.transaction(async (tx) => {
      if (existOtp) {
        await this.otpRepository.deleteOtp(
          { identifier: params.identifier },
          tx,
        );
      }
      return await this.otpRepository.createOtp(params, tx);
    });

    // Only send SMS when production
    await this.smsService.sendSms({
      targetPhoneNumber: params.phoneNumber,
      content: `[갈길이머니] 본인 확인 인증번호는 (${otp.code})입니다.`,
    });

    return otp;
  }
}
