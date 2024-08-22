import { Controller, Logger, UseGuards } from '@nestjs/common';
import { UserService } from '@src/v1/user/user.service';
import {
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import { Uuid } from '@src/shared/types/primitive';
import { UserQuery, UserWithoutPasswordDto } from './user.dto';
import { userToDto } from '@src/shared/helpers/transofrm/user';
import { DEFAULT_PAGINATION } from '@src/core/pagination.constant';
import { AuthHeaders } from '@src/v1/auth/auth.headers';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { SessionUser } from '@src/core/decorators/session-user.decorator';
import { ISessionWithUser } from '@src/v1/auth/session.interface';
import { IErrorResponse } from '@src/shared/types/response';

@Controller('v1/user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @TypedRoute.Get('/')
  @Roles('admin', 'manager', 'teacher')
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'Not enough [role] to access this resource.',
  })
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

  @TypedRoute.Get('/me')
  @TypedException<IErrorResponse<401>>({
    status: 401,
    description: 'Session user not found.',
  })
  async getCurrentUser(
    @TypedHeaders() headers: AuthHeaders,
    @SessionUser() session: ISessionWithUser,
  ): Promise<UserWithoutPasswordDto> {
    return userToDto(session.user);
  }

  @TypedRoute.Get('/:id')
  @Roles('admin', 'manager', 'teacher')
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'Not enough [role] to access this resource.',
  })
  @UseGuards(RolesGuard)
  async getUser(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('id') id: Uuid,
  ): Promise<UserWithoutPasswordDto | null> {
    const user = await this.userService.findUserById({ id });
    return user ? userToDto(user) : null;
  }
}
