import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserCourseEnrollmentQueryRepository } from '@src/v1/user/course/enrollment/user-course-enrollment-query.repository';
import { ICourseEnrollment } from '@src/v1/course/enrollment/course-enrollment.interface';
import { ICourseEnrollmentCertificate } from '@src/v1/user/course/enrollment/user-course-enrollment-relations.interface';
import { CourseEnrollmentProgressRepository } from '@src/v1/course/enrollment/progress/course-enrollment-progress.repository';
import { CourseEnrollmentQueryRepository } from '@src/v1/course/enrollment/course-enrollment-query.repository';
import {
  ICourseEnrollmentProgress,
  ICourseEnrollmentProgressCreate,
} from '@src/v1/course/enrollment/progress/course-enrollment-progress.interface';
import { CourseEnrollmentProgressQueryRepository } from '@src/v1/course/enrollment/progress/course-enrollment-progress-query.repository';

@Injectable()
export class UserCourseEnrollmentService {
  constructor(
    private readonly userCourseEnrollmentQueryRepository: UserCourseEnrollmentQueryRepository,
    private readonly courseEnrollmentQueryRepository: CourseEnrollmentQueryRepository,
    private readonly courseEnrollmentProgressRepository: CourseEnrollmentProgressRepository,
    private readonly courseEnrollmentProgressQueryRepository: CourseEnrollmentProgressQueryRepository,
  ) {}

  async findEnrolledCourses(
    where: Pick<ICourseEnrollment, 'userId'>,
  ): Promise<ICourseEnrollmentCertificate[]> {
    return await this.userCourseEnrollmentQueryRepository.findEnrolledCourses(
      where,
    );
  }

  async findEnrolledCourse(
    where: Pick<ICourseEnrollment, 'userId' | 'courseId'>,
  ): Promise<ICourseEnrollmentCertificate | null> {
    return await this.userCourseEnrollmentQueryRepository.findEnrolledCourse(
      where,
    );
  }

  // Todo: Impl 100% complete progress
  async createEnrollmentProgress(
    enrollmentParams: Pick<ICourseEnrollment, 'userId' | 'courseId'>,
    { lessonId }: Pick<ICourseEnrollmentProgressCreate, 'lessonId'>,
  ): Promise<ICourseEnrollmentProgress> {
    const enrollment =
      await this.courseEnrollmentQueryRepository.findCourseEnrollment(
        enrollmentParams,
      );

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    const alreadyCompleted =
      await this.courseEnrollmentProgressQueryRepository.findCourseEnrollmentProgress(
        {
          enrollmentId: enrollment.id,
          lessonId,
        },
      );

    if (alreadyCompleted) {
      throw new ConflictException('Lesson already completed');
    }

    const lessonCompleted =
      await this.courseEnrollmentProgressRepository.createCourseEnrollmentProgress(
        {
          enrollmentId: enrollment.id,
          lessonId,
        },
      );

    return lessonCompleted;
  }
}
