import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '@src/v1/user/user.service';
import { IUserLogin, IUserSignUp } from '@src/v1/auth/auth.interface';
import * as typia from 'typia';
import * as date from '@src/shared/utils/date';
import { IUser, IUserWithoutPassword } from '@src/v1/user/user.interface';
import { compareHash } from '@src/shared/helpers/hash';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { SessionRepository } from '@src/v1/auth/session.repository';
import { ISessionWithUser } from '@src/v1/auth/session.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly sessionRepository: SessionRepository,
    private readonly drizzle: DrizzleService,
  ) {}

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

  async signUpUser(params: IUserSignUp): Promise<IUserWithoutPassword> {
    const exist = await this.userService.findUserByEmail({
      email: params.userCreateParams.email,
    });

    if (exist) {
      throw new ConflictException('User already exists');
    }

    const user = await this.drizzle.db.transaction(async (tx) => {
      return await this.userService.createUser(params, tx);
    });

    return user;
  }

  async updateUserRole({
    id,
    role,
  }: Pick<IUser, 'id' | 'role'>): Promise<IUserWithoutPassword> {
    return await this.userService.updateUser({ id }, { role }, this.drizzle.db);
  }

  async validateSession({
    sessionId,
  }: {
    sessionId: string;
  }): Promise<ISessionWithUser | null> {
    const sessionWithUser =
      await this.sessionRepository.findSessionWithUserById({
        id: sessionId,
      });

    if (!sessionWithUser) {
      return null;
    }

    const expired = date.isBefore(sessionWithUser.expiresAt, date.now('date'));

    if (expired) {
      return null;
    }

    return sessionWithUser;
  }
}
