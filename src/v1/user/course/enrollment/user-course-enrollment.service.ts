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
import { CourseCertificateRepository } from '@src/v1/course/enrollment/certificate/course-certificate.repository';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ICourseCertificate } from '@src/v1/course/enrollment/certificate/course-certificate.interface';

@Injectable()
export class UserCourseEnrollmentService {
  constructor(
    private readonly userCourseEnrollmentQueryRepository: UserCourseEnrollmentQueryRepository,
    private readonly courseEnrollmentQueryRepository: CourseEnrollmentQueryRepository,
    private readonly courseEnrollmentProgressRepository: CourseEnrollmentProgressRepository,
    private readonly courseEnrollmentProgressQueryRepository: CourseEnrollmentProgressQueryRepository,
    private readonly courseCertificateRepository: CourseCertificateRepository,
    private readonly drizzle: DrizzleService,
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
  ): Promise<{
    completedProgress: ICourseEnrollmentProgress;
    courseCertificate: ICourseCertificate | null;
  }> {
    const enrolledCourse = await this.findEnrolledCourse(enrollmentParams);

    if (!enrolledCourse) {
      throw new NotFoundException('Enrollment not found');
    }

    const { enrollment, course, progresses, certificate } = enrolledCourse;

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

    const completedLessonCount = progresses.length;
    const totalLessonCount = course.chapters.reduce(
      (acc, chapter) => acc + chapter.lessons.length,
      0,
    );

    // If complete 100% of lessons, create certificate.
    return await this.drizzle.db.transaction(async (tx) => {
      const courseCertificate =
        !certificate && completedLessonCount + 1 >= totalLessonCount
          ? await this.courseCertificateRepository.createCourseCertificate(
              {
                enrollmentId: enrollment.id,
              },
              tx,
            )
          : null;

      const completedProgress =
        await this.courseEnrollmentProgressRepository.createCourseEnrollmentProgress(
          {
            enrollmentId: enrollment.id,
            lessonId,
          },
          tx,
        );

      return { completedProgress, courseCertificate };
    });
  }
}
