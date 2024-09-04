import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import {
  ICourseEnrollmentProgress,
  ICourseEnrollmentProgressCreate,
} from '@src/v1/course/enrollment/progress/course-enrollment-progress.interface';

@Injectable()
export class CourseEnrollmentProgressRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createCourseEnrollmentProgress(
    params: ICourseEnrollmentProgressCreate,
    db = this.drizzle.db,
  ): Promise<ICourseEnrollmentProgress> {
    const [courseEnrollment] = await db
      .insert(dbSchema.courseEnrollmentProgresses)
      .values(params)
      .returning();

    return courseEnrollment;
  }
}
