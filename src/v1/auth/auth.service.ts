import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { IUserLogin, IUserSignup } from './auth.interface';
import * as typia from 'typia';
import { IUserWithoutPassword } from '../user/user.interface';
import { compareHash } from '../../shared/helpers/hash';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly userService: UserService) {}

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
      throw new NotFoundException('User not found');
    }

    return typia.misc.clone<IUserWithoutPassword>(user);
  }

  async signupUser(params: IUserSignup): Promise<IUserWithoutPassword> {
    const exist = await this.userService.findUserByEmail({
      email: params.userCreateParams.email,
    });

    if (exist) {
      throw new ConflictException('User already exists');
    }

    return await this.userService.createUser(params);
  }
}
