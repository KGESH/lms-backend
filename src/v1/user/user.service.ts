import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { IUser, IUserUpdate, IUserWithoutPassword } from './user.interface';
import { Pagination } from '../../shared/types/pagination';
import * as typia from 'typia';
import { UserInfoRepository } from './user-info.repository';
import { IUserSignUp } from '../auth/auth.interface';
import { createUuid } from '../../shared/utils/uuid';
import { UserAccountRepository } from './user-account.repository';
import { TransactionClient } from '../../infra/db/drizzle.types';
import {
  DEFAULT_ORDER_BY,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from '../../core/pagination.constant';
import { UserQueryRepository } from './user-query.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userQueryRepository: UserQueryRepository,
    private readonly userInfoRepository: UserInfoRepository,
    private readonly userAccountRepository: UserAccountRepository,
  ) {}

  async findUsers(
    pagination: Pagination = {
      page: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
      orderBy: DEFAULT_ORDER_BY,
    },
  ): Promise<IUserWithoutPassword[]> {
    const users = await this.userQueryRepository.findMany(pagination);
    return users.map((user) => typia.misc.clone<IUserWithoutPassword>(user));
  }

  async findUserById(
    query: Pick<IUser, 'id'>,
  ): Promise<IUserWithoutPassword | null> {
    const user = await this.userQueryRepository.findOne(query);
    return user ? typia.misc.clone<IUserWithoutPassword>(user) : null;
  }

  async findUserByIdOrThrow(
    query: Pick<IUser, 'id'>,
  ): Promise<IUserWithoutPassword> {
    const user = await this.userQueryRepository.findOneOrThrow(query);
    return typia.misc.clone<IUserWithoutPassword>(user);
  }

  async findUserByEmail(query: Pick<IUser, 'email'>): Promise<IUser | null> {
    const user = await this.userQueryRepository.findUserByEmail(query);
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
