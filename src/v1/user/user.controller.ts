import { Controller, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { IUserWithoutPassword } from './user.interface';
import { Uuid } from '../../shared/types/primitive';
import { PaginationDto } from './user.dto';
import {
  DEFAULT_CURSOR,
  DEFAULT_ORDER_BY,
  DEFAULT_PAGE_SIZE,
} from './user.constant';
import { IResponse } from '../../shared/types/response';

@Controller('v1/user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @TypedRoute.Get('/')
  async getUsers(
    @TypedQuery() query: PaginationDto,
  ): Promise<IResponse<IUserWithoutPassword[]>> {
    this.logger.debug('[PAGE QUERY]', query);
    const users = await this.userService.findUsers({
      cursor: query.cursor ?? DEFAULT_CURSOR,
      pageSize: query.pageSize ?? DEFAULT_PAGE_SIZE,
      orderBy: query.orderBy ?? DEFAULT_ORDER_BY,
    });
    return {
      data: users,
    };
  }

  @TypedRoute.Get('/:id')
  async getUser(
    @TypedParam('id') id: Uuid,
  ): Promise<IResponse<IUserWithoutPassword | null>> {
    this.logger.debug(`Get user by id: ${id}`);
    const user = await this.userService.findUserById({ id });
    return {
      data: user,
    };
  }
}
