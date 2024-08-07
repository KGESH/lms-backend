import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { IUser, IUserCreate, IUserWithoutPassword } from './user.interface';
import { IPagination } from '../../shared/types/pagination';
import * as typia from 'typia';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

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

  async findUserByEmail(
    query: Pick<IUser, 'email'>,
  ): Promise<IUserWithoutPassword | null> {
    const user = await this.userRepository.findUserByEmail(query);
    return user ? typia.misc.clone<IUserWithoutPassword>(user) : null;
  }

  async createUser(params: IUserCreate): Promise<IUserWithoutPassword> {
    const user = await this.userRepository.create(params);
    return typia.misc.clone<IUserWithoutPassword>(user);
  }
}
