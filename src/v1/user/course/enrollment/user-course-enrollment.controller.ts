import { Controller, UseGuards } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
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
import { courseRelationsToDto } from '@src/shared/helpers/transofrm/course';
import { enrollmentToDto } from '@src/shared/helpers/transofrm/enrollment';
import { certificateToDto } from '@src/shared/helpers/transofrm/certifacate';
import * as date from '@src/shared/utils/date';
import { CourseEnrollmentLessonCompleteDto } from '@src/v1/course/enrollment/progress/course-enrollment-progress.dto';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';
import { Uuid } from '@src/shared/types/primitive';

@Controller('v1/user/enrollment/course')
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
   * @summary 수강 내역 목록 조회 - Role('user')
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
    const enrolledCourses =
      await this.userCourseEnrollmentService.findEnrolledCourses({
        userId: session.userId,
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
   * 현재 사용자의 특정 강의의 수강 내역을 조회합니다.
   *
   * 현재 사용자의 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag user
   * @summary 특정 강의 수강 내역 목록 조회 - Role('user')
   */
  @TypedRoute.Get('/:courseId')
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
  async getCourseEnrollment(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('courseId') courseId: Uuid,
    @SessionUser() session: ISessionWithUser,
  ): Promise<CourseEnrollmentCertificateDto | null> {
    const enrolledCourse =
      await this.userCourseEnrollmentService.findEnrolledCourse({
        userId: session.userId,
        courseId,
      });

    if (!enrolledCourse) {
      return null;
    }

    return {
      course: courseRelationsToDto(enrolledCourse.course),
      enrollment: enrollmentToDto(enrolledCourse.enrollment),
      certificate: enrolledCourse.certificate
        ? certificateToDto(enrolledCourse.certificate)
        : null,
      progresses: enrolledCourse.progresses.map((p) => ({
        ...p,
        createdAt: date.toISOString(p.createdAt),
      })),
    };
  }

  /**
   * 레슨을 완료합니다.
   *
   * 레슨을 완료하면 해당 레슨의 진도가 저장되며, 이후에는 중복 완료가 불가능합니다.
   *
   * 레슨 완료 성공 이후 100% 진도가 달성되면 응답의 certificate 필드가 null이 아닌 CourseCertificateDto로 반환됩니다.
   *
   * 레슨 완료 성공 이후 100% 진도가 달성되지 않으면 응답의 certificate 필드가 null입니다.
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
  ): Promise<CourseEnrollmentLessonCompleteDto> {
    const { completedProgress, courseCertificate } =
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
      completed: {
        ...completedProgress,
        createdAt: date.toISOString(completedProgress.createdAt),
      },
      certificate: courseCertificate
        ? certificateToDto(courseCertificate)
        : null,
    };
  }
}
