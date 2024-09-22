import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedRoute,
} from '@nestia/core';
import {
  LoginUserDto,
  SignUpUserDto,
  UpdatePasswordDto,
} from '@src/v1/auth/auth.dto';
import { KakaoLoginDto } from '@src/v1/auth/kakao-auth.dto';
import { KakaoAuthService } from '@src/v1/auth/kakao-auth.service';
import { UserWithoutPasswordDto } from '@src/v1/user/user.dto';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { userToDto } from '@src/shared/helpers/transofrm/user';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';
import { SessionUser } from '@src/core/decorators/session-user.decorator';
import { ISessionWithUser } from '@src/v1/auth/session.interface';

@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly kakaoAuthService: KakaoAuthService,
  ) {}

  /**
   * 카카오 계정으로 로그인합니다.
   *
   * 프론트엔드에서 카카오 oauth 토큰 발급 (카카오 로그인 버튼 클릭) 성공 이후
   *
   * 카카오 사용자 조회하여 없으면 회원가입, 있으면 로그인 처리합니다.
   *
   * 이미 가입된 이메일 로그인 계정이 존재하면 409 예외를 반환합니다.
   *
   * @tag auth
   * @summary 카카오 로그인 (public)
   */
  @TypedRoute.Post('/kakao/login')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<409>>({
    status: 409,
    description: 'User already exists',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async kakaoLogin(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedBody() body: KakaoLoginDto,
  ): Promise<UserWithoutPasswordDto> {
    const user = await this.kakaoAuthService.login(body);
    return userToDto(user);
  }

  /**
   * 이메일 계정으로 로그인합니다.
   *
   * 이메일 또는 패스워드가 일치하지 않으면 404 예외를 반환합니다.
   *
   * @tag auth
   * @summary 이메일 계정 로그인 (public)
   */
  @TypedRoute.Post('/login')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'user not found',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async login(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedBody() body: LoginUserDto,
  ): Promise<UserWithoutPasswordDto> {
    const user = await this.authService.login(body);
    return userToDto(user);
  }

  /**
   * 이메일 계정으로 회원가입합니다.
   *
   * 이미 가입된 이메일이 존재하면 409 예외를 반환합니다.
   *
   * @tag auth
   * @summary 이메일 계정 회원가입 (public)
   */
  @TypedRoute.Post('/signup')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<409>>({
    status: 409,
    description: 'user already exists',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async signup(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedBody() body: SignUpUserDto,
  ): Promise<UserWithoutPasswordDto> {
    const user = await this.authService.signUpUser(body);
    return userToDto(user);
  }

  /**
   * 현재 세션 사용자의 비밀번호를 변경합니다. (이메일 계정)
   *
   * @tag auth
   * @summary 이메일 계정 비밀번호 변경
   */
  @TypedRoute.Patch('/password')
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'user not found',
  })
  @TypedException<IErrorResponse<409>>({
    status: 409,
    description: 'new password is the same as the old one',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async changePassword(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: UpdatePasswordDto,
    @SessionUser() session: ISessionWithUser,
  ): Promise<UserWithoutPasswordDto> {
    const user = await this.authService.updatePassword({
      id: session.userId,
      ...body,
    });
    return userToDto(user);
  }
}
