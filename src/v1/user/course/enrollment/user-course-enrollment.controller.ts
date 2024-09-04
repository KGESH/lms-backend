import { Controller, UseGuards } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedRoute,
} from '@nestia/core';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { SessionUser } from '@src/core/decorators/session-user.decorator';
import { ISessionWithUser } from '@src/v1/auth/session.interface';
import { UserCourseEnrollmentService } from '@src/v1/user/course/enrollment/user-course-enrollment.service';
import { AuthHeaders } from '@src/v1/auth/auth.headers';
import {
  CompleteLessonDto,
  CourseEnrollmentCertificateDto,
} from '@src/v1/user/course/enrollment/user-course-enrollment.dto';
import { courseToDto } from '@src/shared/helpers/transofrm/course';
import { enrollmentToDto } from '@src/shared/helpers/transofrm/enrollment';
import { certificateToDto } from '@src/shared/helpers/transofrm/certifacate';
import * as date from '@src/shared/utils/date';
import { CourseEnrollmentProgressDto } from '@src/v1/course/enrollment/progress/course-enrollment-progress.dto';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';

@Controller('v1/user/course/enrollment')
export class UserCourseEnrollmentController {
  constructor(
    private readonly userCourseEnrollmentService: UserCourseEnrollmentService,
  ) {}

  /**
   * 현재 사용자의 수강 내역 목록을 조회합니다.
   *
   * 현재 사용자의 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag user
   * @summary 사용자 수강 내역 목록 조회 - Role('user')
   */
  @TypedRoute.Get('/')
  @Roles('user')
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
  async getCourseEnrollments(
    @TypedHeaders() headers: AuthHeaders,
    @SessionUser() session: ISessionWithUser,
  ): Promise<CourseEnrollmentCertificateDto[]> {
    const enrollments =
      await this.userCourseEnrollmentService.findEnrolledCourses({
        userId: session.userId,
      });

    return enrollments.map(
      ({ course, enrollment, certificate, progresses }) => ({
        course: courseToDto(course),
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
   * 레슨을 완료합니다.
   *
   * 레슨을 완료하면 해당 레슨의 진도가 저장되며, 이후에는 중복 완료가 불가능합니다.
   *
   * 현재 사용자의 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag user
   * @summary 레슨 완료 - Role('user')
   */
  @TypedRoute.Post('/')
  @Roles('user')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'Not enough [role] to access this resource.',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'enrollment not found',
  })
  @TypedException<IErrorResponse<409>>({
    status: 409,
    description: 'lesson already completed',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async completeLesson(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CompleteLessonDto,
    @SessionUser() session: ISessionWithUser,
  ): Promise<CourseEnrollmentProgressDto> {
    const completed =
      await this.userCourseEnrollmentService.createEnrollmentProgress(
        {
          userId: session.userId,
          courseId: body.courseId,
        },
        {
          lessonId: body.lessonId,
        },
      );

    return {
      ...completed,
      createdAt: date.toISOString(completed.createdAt),
    };
  }
}
