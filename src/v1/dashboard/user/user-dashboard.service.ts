import { Injectable } from '@nestjs/common';
import { UserDashboardQueryRepository } from '@src/v1/dashboard/user/user-dashboard-query.repository';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';
import { Uuid } from '@src/shared/types/primitive';
import { IUserCourseResourceHistory } from '@src/v1/dashboard/user/user-dashboard.interface';
import { UserCourseEnrollmentService } from '@src/v1/user/course/enrollment/user-course-enrollment.service';
import { ICourseEnrollmentCertificate } from '@src/v1/user/course/enrollment/user-course-enrollment-relations.interface';
import { ICourseEnrollment } from '@src/v1/course/enrollment/course-enrollment.interface';
import { Pagination } from '@src/shared/types/pagination';

@Injectable()
export class UserDashboardService {
  constructor(
    private readonly userCourseEnrollmentService: UserCourseEnrollmentService,
    private readonly userDashboardQueryRepository: UserDashboardQueryRepository,
  ) {}

  async findCourseEnrolledHistories(
    where: Pick<ICourseEnrollment, 'userId'>,
  ): Promise<ICourseEnrollmentCertificate[]> {
    return await this.userCourseEnrollmentService.findEnrolledCourses(where);
  }

  async findUserCourseResourceHistories(where: {
    userId: Uuid;
    courseId: Uuid;
  }): Promise<IUserCourseResourceHistory[]> {
    return await this.userDashboardQueryRepository.findUserCourseResourceHistory(
      where,
    );
  }

  async findPurchasedCourseUsers(where: {
    courseId: Uuid;
  }): Promise<IUserWithoutPassword[]> {
    return await this.userDashboardQueryRepository.findPurchasedCourseUsers(
      where,
    );
  }
}
