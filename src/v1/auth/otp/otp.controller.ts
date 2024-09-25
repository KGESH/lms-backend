import { Controller, Logger } from '@nestjs/common';
import { OtpService } from '@src/v1/auth/otp/otp.service';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedRoute,
} from '@nestia/core';
import { ApiAuthHeaders } from '@src/v1/auth/auth.headers';
import {
  OtpDto,
  SignupOtpDto,
  VerifyOtpDto,
  VerifyOtpResponseDto,
} from '@src/v1/auth/otp/otp.dto';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import * as date from '@src/shared/utils/date';

@Controller('v1/otp')
export class OtpController {
  private readonly logger = new Logger(OtpController.name);
  constructor(private readonly otpService: OtpService) {}

  /**
   * 이메일 회원가입시 휴대폰 인증을 위한 6자리 숫자 인증번호를 전송합니다.
   *
   * 동일한 휴대폰 번호로 인증번호를 전송한 기록이 있는 경우, 가장 마지막에 전송한 인증번호만 유효합니다.
   *
   * 인증 코드의 유효 시간은 **3분**입니다.
   *
   * 이미 가입된 흎대폰 번호인 경우, 409 예외를 반환합니다.
   *
   * @tag otp
   * @summary 이메일 회원가입 휴대폰 인증번호 전송
   */
  @TypedRoute.Post('/signup')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<409>>({
    status: 409,
    description: 'User already exist.',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async sendSignupOtp(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedBody() body: SignupOtpDto,
  ): Promise<OtpDto> {
    const otp = await this.otpService.sendSignupOtp({
      phoneNumber: body.phoneNumber,
    });

    return {
      ...otp,
      expires: date.toISOString(otp.expires),
      createdAt: date.toISOString(otp.createdAt),
    };
  }

  /**
   * 이메일 회원가입시 전송한 휴대폰 인증번호를 검증합니다.
   *
   * 동일한 휴대폰 번호로 인증번호를 전송한 기록이 있는 경우, 가장 마지막에 전송한 인증번호만 유효합니다.
   *
   * 인증 코드의 유효 시간은 **3분**입니다.
   *
   * @tag otp
   * @summary 이메일 회원가입 휴대폰 인증번호 검증
   */
  @TypedRoute.Post('/signup/verify')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async verifySignupOtp(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedBody() body: VerifyOtpDto,
  ): Promise<VerifyOtpResponseDto> {
    const isValid = await this.otpService.verifySignupOtp({
      code: body.code,
      identifier: body.identifier,
    });

    return { isValid };
  }
}
