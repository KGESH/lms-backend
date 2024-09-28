import { Controller, UseGuards } from '@nestjs/common';
import { UserDashboardService } from '@src/v1/dashboard/user/user-dashboard.service';
import {
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import { userToDto } from '@src/shared/helpers/transofrm/user';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { AuthHeaders } from '@src/v1/auth/auth.headers';
import {
  CourseResourceHistoryQuery,
  PurchasedCourseUsersQuery,
  PurchasedEbookUsersQuery,
  PurchasedUserDto,
  UserCourseEnrollmentHistoriesQuery,
  UserCourseResourceHistoryDto,
} from '@src/v1/dashboard/user/user-dashboard.dto';
import * as date from '@src/shared/utils/date';
import { CourseEnrollmentCertificateDto } from '@src/v1/user/course/enrollment/user-course-enrollment.dto';
import { courseRelationsToDto } from '@src/shared/helpers/transofrm/course';
import { enrollmentToDto } from '@src/shared/helpers/transofrm/enrollment';
import { certificateToDto } from '@src/shared/helpers/transofrm/certifacate';
import { Paginated } from '@src/shared/types/pagination';
import { withDefaultPagination } from '@src/core/pagination';
import { orderToDto } from '@src/shared/helpers/transofrm/course-order';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';
import { UserQuery, UserWithoutPasswordDto } from '@src/v1/user/user.dto';
import { UserService } from '@src/v1/user/user.service';
import { Uuid } from '@src/shared/types/primitive';

@Controller('v1/dashboard/user')
export class UserDashboardController {
  constructor(
    private readonly userService: UserService,
    private readonly userDashboardService: UserDashboardService,
  ) {}

  /**
   * 사용자 목록을 조회합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * Query parameter 'role'을 통해 사용자 권한을 필터링할 수 있습니다.
   *
   * Query parameter 'email'을 통해 사용자 이메일에 특정 문자열이 포함된 사용자를 조회할 수 있습니다.
   *
   * Query parameter 'displayName'을 통해 사용자 닉네임에 특정 문자열이 포함된 사용자를 조회할 수 있습니다.
   *
   * Query parameter 'name'을 통해 사용자 이름에 특정 문자열이 포함된 사용자를 조회할 수 있습니다.
   *
   * @tag dashboard
   * @summary 사용자 목록 조회 - Role('admin', 'manager', 'teacher')
   */
  @TypedRoute.Get('/')
  @Roles('admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'Not enough [role] to access this resource.',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async getUsers(
    @TypedHeaders() headers: AuthHeaders,
    @TypedQuery() query: UserQuery,
  ): Promise<Paginated<UserWithoutPasswordDto[]>> {
    const { data: users, ...paginated } = await this.userService.findUsers(
      query,
      withDefaultPagination(query),
    );

    return {
      ...paginated,
      data: users.map(userToDto),
    };
  }

  /**
   * 특정 사용자를 조회합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag dashboard
   * @summary 특정 사용자 조회 - Role('admin', 'manager', 'teacher')
   * @param id - 조회할 사용자의 id
   */
  @TypedRoute.Get('/:id')
  @Roles('admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'Not enough [role] to access this resource.',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async getUser(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('id') id: Uuid,
  ): Promise<UserWithoutPasswordDto | null> {
    const user = await this.userService.findUserById({ id });
    return user ? userToDto(user) : null;
  }

  /**
   * 특정 사용자의 수강 내역 목록을 조회합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag dashboard
   * @summary 특정 사용자의 수강 내역 목록 조회 - Role('admin', 'manager')
   * @param userId - 조회할 사용자 id
   * @param courseId - 강의 id
   */
  @TypedRoute.Get('/enrollment/course')
  @Roles('admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'Not enough [role] to access this resource.',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async getUserCourseEnrollmentHistories(
    @TypedHeaders() headers: AuthHeaders,
    @TypedQuery() query: UserCourseEnrollmentHistoriesQuery,
  ): Promise<CourseEnrollmentCertificateDto[]> {
    const enrolledCourses =
      await this.userDashboardService.findCourseEnrolledHistories({
        userId: query.userId,
      });

    return enrolledCourses.map(
      ({ course, enrollment, certificate, progresses }) => ({
        course: courseRelationsToDto(course),
        enrollment: enrollmentToDto(enrollment),
        certificate: certificate ? certificateToDto(certificate) : null,
        progresses: progresses.map((p) => ({
          ...p,
          createdAt: date.toISOString(p.createdAt),
        })),
      }),
    );
  }

  /**
   * 특정 사용자가 특정 강의의 리소스에 접근한 기록 목록을 조회합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag dashboard
   * @summary 특정 사용자의 특정 강의 리소스 접근 기록 조회 - Role('admin', 'manager')
   * @query userId - 조회할 사용자 id
   * @query courseId - 강의 id
   */
  @TypedRoute.Get('/history/course')
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
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async getUserCourseResourceHistories(
    @TypedHeaders() headers: AuthHeaders,
    @TypedQuery() query: CourseResourceHistoryQuery,
  ): Promise<UserCourseResourceHistoryDto[]> {
    const histories =
      await this.userDashboardService.findUserCourseResourceHistories({
        userId: query.userId,
        courseId: query.courseId,
      });

    return histories.map(({ courseId, history }) => ({
      courseId,
      history: {
        ...history,
        createdAt: date.toISOString(history.createdAt),
      },
    }));
  }

  /**
   * 특정 강의를 구매한 사용자 목록을 조회합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag dashboard
   * @summary 특정 강의를 구매한 사용자 목록 조회 - Role('admin', 'manager')
   * @query courseId - 강의 id
   */
  @TypedRoute.Get('/purchased/course')
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
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async getPurchasedCourseUsers(
    @TypedHeaders() headers: AuthHeaders,
    @TypedQuery() query: PurchasedCourseUsersQuery,
  ): Promise<Paginated<PurchasedUserDto[]>> {
    const paginatedUsers =
      await this.userDashboardService.findPurchasedCourseUsers(
        { courseId: query.courseId },
        withDefaultPagination(query),
      );

    return {
      pagination: paginatedUsers.pagination,
      totalCount: paginatedUsers.totalCount,
      data: paginatedUsers.data.map(({ user, order }) => ({
        user: userToDto(user),
        order: orderToDto(order),
      })),
    };
  }

  /**
   * 특정 전자책을 구매한 사용자 목록을 조회합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag dashboard
   * @summary 특정 전자책을 구매한 사용자 목록 조회 - Role('admin', 'manager')
   * @query ebookId - 전자책 id
   */
  @TypedRoute.Get('/purchased/ebook')
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
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async getPurchasedEbookUsers(
    @TypedHeaders() headers: AuthHeaders,
    @TypedQuery() query: PurchasedEbookUsersQuery,
  ): Promise<Paginated<PurchasedUserDto[]>> {
    const paginatedUsers =
      await this.userDashboardService.findPurchasedEbookUsers(
        { ebookId: query.ebookId },
        withDefaultPagination(query),
      );

    return {
      pagination: paginatedUsers.pagination,
      totalCount: paginatedUsers.totalCount,
      data: paginatedUsers.data.map(({ user, order }) => ({
        user: userToDto(user),
        order: orderToDto(order),
      })),
    };
  }
}
