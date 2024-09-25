import { ConflictException, Injectable } from '@nestjs/common';
import { OtpRepository } from '@src/v1/auth/otp/otp.repository';
import { IOtp, IOtpCreate } from '@src/v1/auth/otp/otp.interface';
import { SmsService } from '@src/infra/sms/sms.service';
import { OtpQueryRepository } from '@src/v1/auth/otp/otp-query.repository';
import * as date from '@src/shared/utils/date';
import { UserService } from '@src/v1/user/user.service';

@Injectable()
export class OtpService {
  constructor(
    private readonly userService: UserService,
    private readonly smsService: SmsService,
    private readonly otpRepository: OtpRepository,
    private readonly otpQueryRepository: OtpQueryRepository,
  ) {}

  async verifyOtp(
    params: Pick<IOtp, 'userId' | 'usage' | 'code'>,
  ): Promise<boolean> {
    const otp = await this.otpQueryRepository.findLatestOtpByCode(params);

    if (!otp) {
      return false;
    }

    return otp.expires >= date.now('date');
  }

  async verifySignupOtp({ code }: Pick<IOtp, 'code'>): Promise<boolean> {
    return await this.verifyOtp({ code, userId: null, usage: 'signup' });
  }

  async sendSignupOtp({ phoneNumber }: { phoneNumber: string }): Promise<IOtp> {
    const existUser = await this.userService.findUserByPhoneNumber({
      phoneNumber,
    });

    if (existUser) {
      throw new ConflictException('User already exist.');
    }

    const random6DigitsNumberString = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const afterOneHour = date.addDate(date.now('date'), 1, 'hour', 'date');

    const otp = await this.createOtp({
      phoneNumber,
      code: random6DigitsNumberString,
      userId: null,
      usage: 'signup',
      expires: afterOneHour,
    });

    return otp;
  }

  async createOtp(params: IOtpCreate & { phoneNumber: string }): Promise<IOtp> {
    const otp = await this.otpRepository.createOtp(params);
    await this.smsService.sendSms({
      targetPhoneNumber: params.phoneNumber,
      content: `[갈길이머니] 본인 확인 인증번호는 (${otp.code})입니다.`,
    });

    return otp;
  }
}
