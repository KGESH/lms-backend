import { Controller, UseGuards } from '@nestjs/common';
import { UserDashboardService } from '@src/v1/dashboard/user/user-dashboard.service';
import {
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { UserWithoutPasswordDto } from '@src/v1/user/user.dto';
import { userToDto } from '@src/shared/helpers/transofrm/user';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { AuthHeaders } from '@src/v1/auth/auth.headers';
import { Uuid } from '@src/shared/types/primitive';

@Controller('v1/dashboard/user')
export class UserDashboardController {
  constructor(private readonly userDashboardService: UserDashboardService) {}

  @TypedRoute.Get('/purchased/course/:courseId')
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
  async findPurchasedCourseUsers(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
  ): Promise<UserWithoutPasswordDto[]> {
    const users = await this.userDashboardService.findPurchasedCourseUsers({
      courseId,
    });

    return users.map(userToDto);
  }
}
