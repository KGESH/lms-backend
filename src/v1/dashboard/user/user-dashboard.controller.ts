import { Controller, UseGuards } from '@nestjs/common';
import { UserDashboardService } from '@src/v1/dashboard/user/user-dashboard.service';
import {
  TypedException,
  TypedHeaders,
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

@Controller('v1/dashboard/user')
export class UserDashboardController {
  constructor(private readonly userDashboardService: UserDashboardService) {}

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
   * @param userId - 조회할 사용자 id
   * @param courseId - 강의 id
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
   * @param courseId - 강의 id
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
}
