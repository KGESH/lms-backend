import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@src/v1/user/user.repository';
import {
  IUser,
  IUserInfo,
  IUserRelations,
  IUserUpdate,
  IUserWithoutPassword,
} from './user.interface';
import { Paginated, Pagination } from '@src/shared/types/pagination';
import { IUserSignUp } from '@src/v1/auth/auth.interface';
import { UserInfoRepository } from '@src/v1/user/user-info.repository';
import { UserAccountRepository } from '@src/v1/user/user-account.repository';
import { UserQueryRepository } from '@src/v1/user/user-query.repository';
import { createUuid } from '@src/shared/utils/uuid';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { OptionalPick } from '@src/shared/types/optional';
import { assertUserWithoutPassword } from '@src/shared/helpers/assert/user';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userQueryRepository: UserQueryRepository,
    private readonly userInfoRepository: UserInfoRepository,
    private readonly userAccountRepository: UserAccountRepository,
  ) {}

  async findUsers(
    where: OptionalPick<IUser, 'role' | 'email' | 'displayName'> &
      OptionalPick<IUserInfo, 'name'>,
    pagination: Pagination,
  ): Promise<Paginated<IUserWithoutPassword[]>> {
    const users = await this.userQueryRepository.findManyUsers(
      where,
      pagination,
    );
    return {
      ...users,
      data: users.data.map((user) => assertUserWithoutPassword(user)),
    };
  }

  async findUserById(
    query: Pick<IUser, 'id'>,
  ): Promise<IUserWithoutPassword | null> {
    const user = await this.userQueryRepository.findOne(query);
    return user ? assertUserWithoutPassword(user) : null;
  }

  async findUserRelationsByIdOrThrow(
    where: Pick<IUser, 'id'>,
  ): Promise<IUserRelations> {
    const userRelations =
      await this.userQueryRepository.findUserRelationsById(where);

    if (!userRelations) {
      throw new NotFoundException('User relations not found');
    }

    return userRelations;
  }

  async findUserByPhoneNumber(where: {
    phoneNumber: string;
  }): Promise<IUserWithoutPassword | null> {
    const user = await this.userQueryRepository.findUserByPhoneNumber(where);

    if (!user) {
      return null;
    }

    return assertUserWithoutPassword(user);
  }

  async findUserByIdOrThrow(
    query: Pick<IUser, 'id'>,
  ): Promise<IUserWithoutPassword> {
    const user = await this.userQueryRepository.findOneOrThrow(query);
    return assertUserWithoutPassword(user);
  }

  async findUserByEmail(query: Pick<IUser, 'email'>): Promise<IUser | null> {
    const user = await this.userQueryRepository.findUserByEmail(query);
    return user;
  }

  async findUserWithPasswordOrThrow(query: Pick<IUser, 'id'>): Promise<IUser> {
    const user = await this.userQueryRepository.findOneOrThrow(query);
    return user;
  }

  async findUserByMatchedUsername(
    where: Pick<IUser, 'displayName'>,
  ): Promise<IUserWithoutPassword | null> {
    const user =
      await this.userQueryRepository.findUserByMatchedUsername(where);
    return user ? assertUserWithoutPassword(user) : null;
  }

  async createUser(
    { userCreateParams, infoCreateParams, accountCreateParams }: IUserSignUp,
    tx?: TransactionClient,
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

    return assertUserWithoutPassword(user);
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

    return assertUserWithoutPassword(updated);
  }
}
