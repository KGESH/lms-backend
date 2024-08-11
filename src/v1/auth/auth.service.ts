import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import {
  IAccessTokenPayload,
  IAuthTokens,
  IRefreshTokenPayload,
  IUserLogin,
  IUserSignup,
} from './auth.interface';
import { signJwt, verifyJwt } from '../../shared/utils/jwt';
import { ConfigsService } from '../../configs/configs.service';
import { ACCESS_TOKEN_EXP_TIME } from './auth.constant';
import * as typia from 'typia';
import { IUserWithoutPassword } from '../user/user.interface';
import { compareHash } from '../../shared/helpers/hash';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configsService: ConfigsService,
    private readonly userService: UserService,
  ) {
    this.jwtSecret = this.configsService.env.JWT_SECRET;
  }

  async login(params: IUserLogin): Promise<IUserWithoutPassword> {
    const user = await this.userService.findUserByEmail(params);

    if (!user?.password || !params.password) {
      throw new NotFoundException('User not found');
    }

    const isCorrectPassword = await compareHash({
      rawValue: params.password,
      hash: user.password,
    });

    if (!isCorrectPassword) {
      throw new NotFoundException('User password not matched');
    }

    return typia.misc.clone<IUserWithoutPassword>(user);
  }

  async signupUser(params: IUserSignup): Promise<IUserWithoutPassword> {
    const exist = await this.userService.findUserByEmail({
      email: params.email,
    });

    if (exist) {
      throw new ConflictException('User already exists');
    }

    return await this.userService.createUser(params);
  }

  async verifyAccessToken(
    token: IAuthTokens['accessToken'],
  ): Promise<IAccessTokenPayload> {
    try {
      const { payload } = await verifyJwt({
        token,
        jwtSecret: this.jwtSecret,
      });

      this.logger.debug('[VerifyAccessTokenPayload]', payload);

      return typia.misc.assertClone<IAccessTokenPayload>(payload);
    } catch (e) {
      this.logger.error(e);
      throw new UnauthorizedException('Invalid access token');
    }
  }

  async refreshToken(
    token: IAuthTokens['refreshToken'],
  ): Promise<Pick<IAuthTokens, 'accessToken'>> {
    try {
      const { payload } = await verifyJwt({
        token,
        jwtSecret: this.jwtSecret,
      });

      this.logger.debug('[RefreshAccessTokenTokenPayload]', payload);

      const { userId } = typia.misc.assertClone<IRefreshTokenPayload>(payload);

      const { email } = await this.userService.findUserByIdOrThrow({
        id: userId,
      });

      const accessTokenPayload: IAccessTokenPayload = {
        userId,
        email,
      };

      const accessToken = await signJwt({
        payload: accessTokenPayload,
        jwtSecret: this.jwtSecret,
        expirationTime: ACCESS_TOKEN_EXP_TIME,
      });

      return { accessToken };
    } catch (e) {
      this.logger.error(e);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
