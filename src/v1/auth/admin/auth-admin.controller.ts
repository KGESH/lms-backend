import { Controller, UseGuards } from '@nestjs/common';
import { AuthService } from '@src/v1/auth/auth.service';
import { AuthAdminService } from '@src/v1/auth/auth-admin.service';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedRoute,
} from '@nestia/core';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';
import { AuthHeaders } from '@src/v1/auth/auth.headers';
import { SignUpUserDto, UpdateUserRoleDto } from '@src/v1/auth/auth.dto';
import { UserWithoutPasswordDto } from '@src/v1/user/user.dto';
import { userToDto } from '@src/shared/helpers/transofrm/user';

@Controller('v1/auth/admin')
export class AuthAdminController {
  constructor(
    private readonly authService: AuthService,
    private readonly authAdminService: AuthAdminService,
  ) {}

  /**
   * 이메일 사용자를 생성합니다. (관리자 API)
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * 이메일 인증이 필요 없이 바로 사용자를 생성합니다.
   *
   * @tag auth
   * @summary 이메일 인증 없이 사용자 생성 - Role('admin', 'manager')
   */
  @TypedRoute.Post('/user')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'Not enough [role] to access this resource.',
  })
  @TypedException<IErrorResponse<409>>({
    status: 409,
    description: 'user already exists',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async createEmailUser(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: SignUpUserDto,
  ): Promise<UserWithoutPasswordDto> {
    const user = await this.authAdminService.createEmailUser(body);
    return userToDto(user);
  }

  /**
   * 특정 사용자의 권한을 변경합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag auth
   * @summary 사용자 권한 변경 - Role('admin', 'manager')
   */
  @TypedRoute.Patch('/role')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'user not found',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async updateUserRole(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: UpdateUserRoleDto,
  ): Promise<UserWithoutPasswordDto> {
    const updated = await this.authService.updateUserRole(body);
    return userToDto(updated);
  }
}
