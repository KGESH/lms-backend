import { Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypedBody, TypedRoute } from '@nestia/core';
import {
  LoginUserDto,
  RefreshTokenDto,
  SignupUserDto,
  VerifyTokenDto,
} from './auth.dto';
import { IAccessTokenPayload, IAuthTokens } from './auth.interface';
import { IUserWithoutPassword } from '../user/user.interface';
import { IResponse } from '../../shared/types/response';

@Controller('v1/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @TypedRoute.Post('/login')
  async login(
    @TypedBody() body: LoginUserDto,
  ): Promise<IResponse<IAuthTokens>> {
    const tokens = await this.authService.login(body);
    return { data: tokens };
  }

  @TypedRoute.Post('/signup')
  async signup(
    @TypedBody() body: SignupUserDto,
  ): Promise<IResponse<IUserWithoutPassword>> {
    const user = await this.authService.signupUser(body);
    return { data: user };
  }

  @TypedRoute.Post('/verify')
  async verifyAccessToken(
    @TypedBody() body: VerifyTokenDto,
  ): Promise<IResponse<IAccessTokenPayload>> {
    const payload = await this.authService.verifyAccessToken(body.accessToken);
    return { data: payload };
  }

  @TypedRoute.Post('/refresh-token')
  async refreshToken(
    @TypedBody() body: RefreshTokenDto,
  ): Promise<IResponse<Pick<IAuthTokens, 'accessToken'>>> {
    const token = await this.authService.refreshToken(body.refreshToken);
    return { data: token };
  }
}
