import { Controller, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Uuid } from '../../shared/types/primitive';
import {
  DEFAULT_CURSOR,
  DEFAULT_ORDER_BY,
  DEFAULT_PAGE_SIZE,
} from '../../core/pagination.constant';
import { PaginationDto } from '../../core/pagination.dto';
import { UserWithoutPasswordDto } from './user.dto';

@Controller('v1/user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @TypedRoute.Get('/')
  async getUsers(
    @TypedQuery() query: PaginationDto,
  ): Promise<UserWithoutPasswordDto[]> {
    const users = await this.userService.findUsers({
      cursor: query.cursor ?? DEFAULT_CURSOR,
      pageSize: query.pageSize ?? DEFAULT_PAGE_SIZE,
      orderBy: query.orderBy ?? DEFAULT_ORDER_BY,
    });
    return users;
  }

  @TypedRoute.Get('/:id')
  async getUser(
    @TypedParam('id') id: Uuid,
  ): Promise<UserWithoutPasswordDto | null> {
    const user = await this.userService.findUserById({ id });
    return user;
  }
}
