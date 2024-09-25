import { Controller } from '@nestjs/common';
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
  constructor(private readonly otpService: OtpService) {}

  @TypedRoute.Post('/signup')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
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
    });

    return { isValid };
  }
}
