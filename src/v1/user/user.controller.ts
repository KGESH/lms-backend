import { Controller, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Uuid } from '../../shared/types/primitive';
import { PaginationDto } from '../../core/pagination.dto';
import { UserWithoutPasswordDto } from './user.dto';
import { userToDto } from '../../shared/helpers/transofrm/user';

@Controller('v1/user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @TypedRoute.Get('/')
  async getUsers(
    @TypedQuery() query: PaginationDto,
  ): Promise<UserWithoutPasswordDto[]> {
    const users = await this.userService.findUsers(query);
    return users.map(userToDto);
  }

  @TypedRoute.Get('/:id')
  async getUser(
    @TypedParam('id') id: Uuid,
  ): Promise<UserWithoutPasswordDto | null> {
    const user = await this.userService.findUserById({ id });
    return user ? userToDto(user) : null;
  }
}
