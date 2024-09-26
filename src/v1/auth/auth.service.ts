import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '@src/v1/user/user.service';
import { IUserLogin, IUserSignUp } from '@src/v1/auth/auth.interface';
import * as typia from 'typia';
import * as date from '@src/shared/utils/date';
import {
  IUser,
  IUserPasswordUpdate,
  IUserWithoutPassword,
} from '@src/v1/user/user.interface';
import { compareHash } from '@src/shared/helpers/hash';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { SessionRepository } from '@src/v1/auth/session.repository';
import { ISessionWithUser } from '@src/v1/auth/session.interface';
import { UserTermService } from '@src/v1/term/user-term.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly userTermService: UserTermService,
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

  async signUpUser(
    userSignupParams: IUserSignUp,
  ): Promise<IUserWithoutPassword> {
    const exist = await this.userService.findUserByEmail({
      email: userSignupParams.userCreateParams.email,
    });

    if (exist) {
      throw new ConflictException('User already exists');
    }

    const user = await this.drizzle.db.transaction(async (tx) => {
      const user = await this.userService.createUser(userSignupParams, tx);
      // Agree terms
      if (userSignupParams.userTerms.length > 0) {
        await this.userTermService.createUserTerms(
          userSignupParams.userTerms.map((term) => ({
            ...term,
            userId: user.id,
          })),
          tx,
        );
      }

      return user;
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

  async updatePassword(
    where: Pick<IUserWithoutPassword, 'id'>,
    params: IUserPasswordUpdate,
  ) {
    if (params.currentPassword === params.newPassword) {
      throw new ConflictException('New password is the same as the old one');
    }

    const user = await this.userService.findUserWithPasswordOrThrow({
      id: where.id,
    });

    const isSamePassword = await compareHash({
      rawValue: params.currentPassword,
      hash: typia.assert<string>(user.password),
    });

    if (!isSamePassword) {
      throw new ForbiddenException('Password is incorrect');
    }

    const updated = await this.userService.updateUser(
      { id: user.id },
      { password: params.newPassword },
      this.drizzle.db,
    );

    return updated;
  }
}
