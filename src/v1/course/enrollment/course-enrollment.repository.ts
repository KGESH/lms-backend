import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  ICourseEnrollment,
  ICourseEnrollmentCreate,
} from '@src/v1/course/enrollment/course-enrollment.interface';
import { dbSchema } from '@src/infra/db/schema';

@Injectable()
export class CourseEnrollmentRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createCourseEnrollment(
    params: ICourseEnrollmentCreate,
    db = this.drizzle.db,
  ): Promise<ICourseEnrollment> {
    const [courseEnrollment] = await db
      .insert(dbSchema.courseEnrollments)
      .values(params)
      .returning();

    return courseEnrollment;
  }
}
