import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  ICourseEnrollment,
  ICourseEnrollmentCreate,
} from '@src/v1/course/enrollment/course-enrollment.interface';
import { dbSchema } from '@src/infra/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class CourseEnrollmentRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findCourseEnrollment(
    where: Pick<ICourseEnrollment, 'userId' | 'courseId'>,
  ) {
    return await this.drizzle.db.query.courseEnrollments.findFirst({
      where: eq(dbSchema.courseEnrollments.userId, where.userId),
    });
  }

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
