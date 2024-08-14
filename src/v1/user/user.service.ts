import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { IUser, IUserUpdate, IUserWithoutPassword } from './user.interface';
import { IPagination } from '../../shared/types/pagination';
import * as typia from 'typia';
import { UserInfoRepository } from './user-info.repository';
import { IUserSignUp } from '../auth/auth.interface';
import { createUuid } from '../../shared/utils/uuid';
import { UserAccountRepository } from './user-account.repository';
import { TransactionClient } from '../../infra/db/drizzle.types';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userInfoRepository: UserInfoRepository,
    private readonly userAccountRepository: UserAccountRepository,
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

  async createUser(
    { userCreateParams, infoCreateParams, accountCreateParams }: IUserSignUp,
    tx: TransactionClient,
  ): Promise<IUserWithoutPassword> {
    const userId = userCreateParams.id ?? createUuid();

    const user = await this.userRepository.create(
      {
        ...userCreateParams,
        id: userId,
      },
      tx,
    );
    await this.userInfoRepository.create(
      {
        ...infoCreateParams,
        userId,
      },
      tx,
    );
    await this.userAccountRepository.create(
      {
        ...accountCreateParams,
        userId,
      },
      tx,
    );

    return typia.misc.clone<IUserWithoutPassword>(user);
  }

  async updateUser(
    where: Pick<IUser, 'id'>,
    params: IUserUpdate,
    tx: TransactionClient,
  ): Promise<IUserWithoutPassword> {
    const user = await this.findUserByIdOrThrow(where);
    const updated = await this.userRepository.update(
      { id: user.id },
      params,
      tx,
    );

    return typia.misc.clone<IUserWithoutPassword>(updated);
  }
}
