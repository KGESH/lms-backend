import { Controller, UseGuards } from '@nestjs/common';
import { TypedHeaders, TypedRoute } from '@nestia/core';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { SessionUser } from '@src/core/decorators/session-user.decorator';
import { ISessionWithUser } from '@src/v1/auth/session.interface';
import { UserCourseEnrollmentService } from '@src/v1/user/course/enrollment/user-course-enrollment.service';
import { AuthHeaders } from '@src/v1/auth/auth.headers';
import { CourseEnrollmentCertificateDto } from '@src/v1/user/course/enrollment/user-course-enrollment.dto';
import { courseToDto } from '@src/shared/helpers/transofrm/course';
import { enrollmentToDto } from '@src/shared/helpers/transofrm/enrollment';
import { certificateToDto } from '@src/shared/helpers/transofrm/certifacate';

@Controller('v1/user/course/enrollment')
export class UserCourseEnrollmentController {
  constructor(
    private readonly userCourseEnrollmentService: UserCourseEnrollmentService,
  ) {}

  /**
   * 현재 사용자의 수강 내역 목록을 조회합니다.
   * 현재 사용자의 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag user
   * @summary 사용자 수강 내역 목록 조회 - Role('user')
   */
  @TypedRoute.Get('/')
  @Roles('user')
  @UseGuards(RolesGuard)
  async getCourseEnrollments(
    @TypedHeaders() headers: AuthHeaders,
    @SessionUser() session: ISessionWithUser,
  ): Promise<CourseEnrollmentCertificateDto[]> {
    const enrollments =
      await this.userCourseEnrollmentService.findEnrolledCourses({
        userId: session.userId,
      });

    return enrollments.map(({ course, enrollment, certificate }) => ({
      course: courseToDto(course),
      enrollment: enrollmentToDto(enrollment),
      certificate: certificate ? certificateToDto(certificate) : null,
    }));
  }
}
