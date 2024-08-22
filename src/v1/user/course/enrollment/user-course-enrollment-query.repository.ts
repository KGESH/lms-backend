import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ICourseEnrollment } from '@src/v1/course/enrollment/course-enrollment.interface';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { ICourseEnrollmentCertificate } from '@src/v1/user/course/enrollment/user-course-enrollment-relations.interface';

@Injectable()
export class UserCourseEnrollmentQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findEnrolledCourses(
    where: Pick<ICourseEnrollment, 'userId'>,
  ): Promise<ICourseEnrollmentCertificate[]> {
    const enrollments = await this.drizzle.db.query.courseEnrollments.findMany({
      where: eq(dbSchema.courseEnrollments.userId, where.userId),
      with: {
        course: true,
        certificate: true,
      },
    });

    return enrollments.map(({ course, certificate, ...enrollment }) => ({
      enrollment: enrollment,
      course,
      certificate,
    }));
  }
}
