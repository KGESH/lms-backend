import { Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypedBody, TypedRoute } from '@nestia/core';
import {
  LoginUserDto,
  RefreshTokenDto,
  SignupUserDto,
  AccessTokenDto,
} from './auth.dto';
import { IAccessTokenPayload, IAuthTokens } from './auth.interface';
import { KakaoLoginDto } from './kakao-auth.dto';
import { KakaoAuthService } from './kakao-auth.service';
import { UserWithoutPasswordDto } from '../user/user.dto';

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

  @TypedRoute.Post('/login')
  async login(
    @TypedBody() body: LoginUserDto,
  ): Promise<UserWithoutPasswordDto> {
    this.logger.log('Login request received', body);

    const user = await this.authService.login(body);
    return user;
  }

  @TypedRoute.Post('/signup')
  async signup(
    @TypedBody() body: SignupUserDto,
  ): Promise<UserWithoutPasswordDto> {
    this.logger.log('Signup request received', body);
    const user = await this.authService.signupUser(body);
    return user;
  }

  @TypedRoute.Post('/verify')
  async verifyAccessToken(
    @TypedBody() body: AccessTokenDto,
  ): Promise<IAccessTokenPayload> {
    const payload = await this.authService.verifyAccessToken(body.accessToken);
    return payload;
  }

  @TypedRoute.Post('/refresh-token')
  async refreshToken(
    @TypedBody() body: RefreshTokenDto,
  ): Promise<Pick<IAuthTokens, 'accessToken'>> {
    const token = await this.authService.refreshToken(body.refreshToken);
    return token;
  }
}
