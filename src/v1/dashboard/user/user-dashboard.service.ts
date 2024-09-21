import { Injectable } from '@nestjs/common';
import { UserDashboardQueryRepository } from '@src/v1/dashboard/user/user-dashboard-query.repository';
import { Uuid } from '@src/shared/types/primitive';
import {
  IPurchasedUser,
  IUserCourseResourceHistory,
} from '@src/v1/dashboard/user/user-dashboard.interface';
import { UserCourseEnrollmentService } from '@src/v1/user/course/enrollment/user-course-enrollment.service';
import { ICourseEnrollmentCertificate } from '@src/v1/user/course/enrollment/user-course-enrollment-relations.interface';
import { ICourseEnrollment } from '@src/v1/course/enrollment/course-enrollment.interface';
import { Paginated, Pagination } from '@src/shared/types/pagination';

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

  async findPurchasedCourseUsers(
    where: { courseId: Uuid },
    pagination: Pagination,
  ): Promise<Paginated<IPurchasedUser[]>> {
    return await this.userDashboardQueryRepository.findPurchasedCourseUsers(
      where,
      pagination,
    );
  }
}
