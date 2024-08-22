import { Injectable } from '@nestjs/common';
import { UserCourseEnrollmentQueryRepository } from '@src/v1/user/course/enrollment/user-course-enrollment-query.repository';
import { ICourseEnrollment } from '@src/v1/course/enrollment/course-enrollment.interface';
import { ICourseEnrollmentCertificate } from '@src/v1/user/course/enrollment/user-course-enrollment-relations.interface';

@Injectable()
export class UserCourseEnrollmentService {
  constructor(
    private readonly userCourseEnrollmentQueryRepository: UserCourseEnrollmentQueryRepository,
  ) {}

  async findEnrolledCourses(
    where: Pick<ICourseEnrollment, 'userId'>,
  ): Promise<ICourseEnrollmentCertificate[]> {
    return await this.userCourseEnrollmentQueryRepository.findEnrolledCourses(
      where,
    );
  }
}
