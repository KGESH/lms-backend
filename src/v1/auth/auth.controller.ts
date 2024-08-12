import { Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypedBody, TypedException, TypedRoute } from '@nestia/core';
import { LoginUserDto, SignupUserDto } from './auth.dto';
import { KakaoLoginDto } from './kakao-auth.dto';
import { KakaoAuthService } from './kakao-auth.service';
import { UserWithoutPasswordDto } from '../user/user.dto';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '../../shared/types/response';

@Controller('v1/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly kakaoAuthService: KakaoAuthService,
  ) {}

  @TypedRoute.Post('/kakao/login')
  async kakaoLogin(
    @TypedBody() body: KakaoLoginDto,
  ): Promise<UserWithoutPasswordDto> {
    this.logger.log('Kakao login request received', body);

    const user = await this.kakaoAuthService.login(body);
    return user;
  }

  @TypedException<TypeGuardError>(400, 'invalid request')
  @TypedException<IErrorResponse<404>>(404, 'user not found')
  @TypedRoute.Post('/login')
  async login(
    @TypedBody() body: LoginUserDto,
  ): Promise<UserWithoutPasswordDto> {
    this.logger.log('Login request received', body);

    const user = await this.authService.login(body);
    return user;
  }

  @TypedException<TypeGuardError>(400, 'invalid request')
  @TypedException<IErrorResponse<409>>(409, 'user already exists')
  @TypedRoute.Post('/signup')
  async signup(
    @TypedBody() body: SignupUserDto,
  ): Promise<UserWithoutPasswordDto> {
    this.logger.log('Signup request received', body);
    const user = await this.authService.signupUser(body);
    return user;
  }
}
