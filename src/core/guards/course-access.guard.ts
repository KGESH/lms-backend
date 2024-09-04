import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as typia from 'typia';
import { ISessionWithUser } from '@src/v1/auth/session.interface';
import { Uuid } from '@src/shared/types/primitive';
import { CourseEnrollmentQueryRepository } from '@src/v1/course/enrollment/course-enrollment-query.repository';

@Injectable()
export class CourseAccessGuard implements CanActivate {
  constructor(
    private readonly courseEnrollmentQueryRepository: CourseEnrollmentQueryRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (!req['user']) {
      throw new InternalServerErrorException(
        'No user found in the request (course-enrollment guard)',
      );
    }

    if (!req.params['courseId']) {
      throw new InternalServerErrorException(
        'No courseId found in the request (course-enrollment guard)',
      );
    }

    const sessionWithUser = typia.assert<ISessionWithUser>(req['user']);

    /**
     * 강의에 접근하는 사용자의 role이 'user'인 경우에는
     * 해당 'course'를 구매한 사용자만 조회할 수 있도록 허용합니다.
     */
    if (sessionWithUser.user.role === 'user') {
      const courseId = typia.assert<Uuid>(req.params['courseId']);
      const enrolled =
        await this.courseEnrollmentQueryRepository.findCourseEnrollment({
          courseId,
          userId: sessionWithUser.userId,
        });

      if (!enrolled) {
        throw new ForbiddenException('User is not enrolled in the course');
      }

      return true;
    }

    /**
     * 강의에 접근하는 사용자의 role이
     * ['admin', 'manager', 'teacher']인 경우에는
     * 강의에 접근할 수 있도록 허용합니다.
     */
    return true;
  }
}
