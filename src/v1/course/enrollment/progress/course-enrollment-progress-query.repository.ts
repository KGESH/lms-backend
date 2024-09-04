import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import { and, eq } from 'drizzle-orm';
import { ICourseEnrollmentProgress } from '@src/v1/course/enrollment/progress/course-enrollment-progress.interface';

@Injectable()
export class CourseEnrollmentProgressQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findCourseEnrollmentProgress(
    where: Pick<ICourseEnrollmentProgress, 'enrollmentId' | 'lessonId'>,
  ): Promise<ICourseEnrollmentProgress | null> {
    const courseEnrollment =
      await this.drizzle.db.query.courseEnrollmentProgresses.findFirst({
        where: and(
          eq(
            dbSchema.courseEnrollmentProgresses.enrollmentId,
            where.enrollmentId,
          ),
          eq(dbSchema.courseEnrollmentProgresses.lessonId, where.lessonId),
        ),
      });

    return courseEnrollment ?? null;
  }
}
