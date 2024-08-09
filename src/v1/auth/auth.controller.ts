import { Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypedBody, TypedRoute } from '@nestia/core';
import {
  LoginUserDto,
  RefreshTokenDto,
  SignupUserDto,
  AccessTokenDto,
  UserWithTokensDto,
} from './auth.dto';
import { IAccessTokenPayload, IAuthTokens } from './auth.interface';
import { OmitPassword } from '../../shared/types/omit-password';
import { IUser } from '../user/user.interface';

@Controller('v1/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @TypedRoute.Post('/login')
  async login(@TypedBody() body: LoginUserDto): Promise<UserWithTokensDto> {
    const { user, tokens } = await this.authService.login(body);
    return {
      user,
      tokens,
    };
  }

  @TypedRoute.Post('/signup')
  async signup(@TypedBody() body: SignupUserDto): Promise<OmitPassword<IUser>> {
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
