import { Injectable } from '@nestjs/common';
import { UserDashboardQueryRepository } from '@src/v1/dashboard/user/user-dashboard-query.repository';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';
import { Uuid } from '@src/shared/types/primitive';
import { IUserCourseResourceHistory } from '@src/v1/dashboard/user/user-dashboard.interface';

@Injectable()
export class UserDashboardService {
  constructor(
    private readonly userDashboardQueryRepository: UserDashboardQueryRepository,
  ) {}

  async findUserCourseResourceHistory(where: {
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
