import { Controller, Logger, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { TypedHeaders, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Uuid } from '../../shared/types/primitive';
import { UserQuery, UserWithoutPasswordDto } from './user.dto';
import { userToDto } from '../../shared/helpers/transofrm/user';
import { DEFAULT_PAGINATION } from '../../core/pagination.constant';
import { AuthHeaders } from '../auth/auth.headers';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';

@Controller('v1/user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @TypedRoute.Get('/')
  @Roles('admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  async getUsers(
    @TypedHeaders() headers: AuthHeaders,
    @TypedQuery() query?: UserQuery,
  ): Promise<UserWithoutPasswordDto[]> {
    const users = await this.userService.findUsers({
      ...DEFAULT_PAGINATION,
      ...query,
    });
    return users.map(userToDto);
  }

  @TypedRoute.Get('/:id')
  async getUser(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('id') id: Uuid,
  ): Promise<UserWithoutPasswordDto | null> {
    const user = await this.userService.findUserById({ id });
    return user ? userToDto(user) : null;
  }
}
