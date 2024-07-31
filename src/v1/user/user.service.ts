import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { IUser, IUserCreate } from './user.interface';
import { IPagination } from '../../shared/types/pagination';
import * as typia from 'typia';
import { OmitPassword } from '../../shared/types/omit-password';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUsers(pagination?: IPagination): Promise<OmitPassword<IUser>[]> {
    const users = await this.userRepository.findMany(pagination);
    return users.map((user) => typia.misc.clone<OmitPassword<IUser>>(user));
  }

  async findUserById(
    query: Pick<IUser, 'id'>,
  ): Promise<OmitPassword<IUser> | null> {
    const user = await this.userRepository.findOne(query);
    return user ? typia.misc.clone<OmitPassword<IUser>>(user) : null;
  }

  async findUserByIdOrThrow(
    query: Pick<IUser, 'id'>,
  ): Promise<OmitPassword<IUser>> {
    const user = await this.userRepository.findOneOrThrow(query);
    return typia.misc.clone<OmitPassword<IUser>>(user);
  }

  async findUserByEmail(
    query: Pick<IUser, 'email'>,
  ): Promise<OmitPassword<IUser> | null> {
    const user = await this.userRepository.findUserByEmail(query);
    return user ? typia.misc.clone<OmitPassword<IUser>>(user) : null;
  }

  async createUser(params: IUserCreate): Promise<OmitPassword<IUser>> {
    const user = await this.userRepository.create(params);
    return typia.misc.clone<OmitPassword<IUser>>(user);
  }
}
