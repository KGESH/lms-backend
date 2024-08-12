import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { IUser, IUserWithoutPassword } from './user.interface';
import { IPagination } from '../../shared/types/pagination';
import * as typia from 'typia';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { UserInfoRepository } from './user-info.repository';
import { IUserSignUp } from '../auth/auth.interface';
import { createUuid } from '../../shared/utils/uuid';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userInfoRepository: UserInfoRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async findUsers(pagination?: IPagination): Promise<IUserWithoutPassword[]> {
    const users = await this.userRepository.findMany(pagination);
    return users.map((user) => typia.misc.clone<IUserWithoutPassword>(user));
  }

  async findUserById(
    query: Pick<IUser, 'id'>,
  ): Promise<IUserWithoutPassword | null> {
    const user = await this.userRepository.findOne(query);
    return user ? typia.misc.clone<IUserWithoutPassword>(user) : null;
  }

  async findUserByIdOrThrow(
    query: Pick<IUser, 'id'>,
  ): Promise<IUserWithoutPassword> {
    const user = await this.userRepository.findOneOrThrow(query);
    return typia.misc.clone<IUserWithoutPassword>(user);
  }

  async findUserByEmail(query: Pick<IUser, 'email'>): Promise<IUser | null> {
    const user = await this.userRepository.findUserByEmail(query);
    return user;
  }

  async createUser({
    userCreateParams,
    infoCreateParams,
  }: IUserSignUp): Promise<IUserWithoutPassword> {
    const userId = userCreateParams.id ?? createUuid();

    const { user, userInfo } = await this.drizzle.db.transaction(async (tx) => {
      const user = await this.userRepository.create(
        {
          ...userCreateParams,
          id: userId,
        },
        tx,
      );
      const userInfo = await this.userInfoRepository.create(
        {
          ...infoCreateParams,
          userId,
        },
        tx,
      );
      return { user, userInfo };
    });
    return typia.misc.clone<IUserWithoutPassword>(user);
  }
}
