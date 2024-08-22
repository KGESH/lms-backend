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

  /**
   * 사용자 목록을 조회합니다.
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag user
   * @summary 사용자 목록 조회 - Role('admin', 'manager', 'teacher')
   */
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

  /**
   * 현재 세션 사용자를 조회합니다.
   * 조회할 대상의 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag user
   * @summary 현재 세션 사용자 조회
   */
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

  /**
   * 특정 사용자를 조회합니다.
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag user
   * @summary 특정 사용자 조회 - Role('admin', 'manager', 'teacher')
   * @param id - 조회할 사용자의 id
   */
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
