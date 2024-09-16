import { Injectable } from '@nestjs/common';
import { UserDashboardQueryRepository } from '@src/v1/dashboard/user/user-dashboard-query.repository';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';
import { Uuid } from '@src/shared/types/primitive';

@Injectable()
export class UserDashboardService {
  constructor(
    private readonly userDashboardQueryRepository: UserDashboardQueryRepository,
  ) {}

  async findPurchasedCourseUsers(where: {
    courseId: Uuid;
  }): Promise<IUserWithoutPassword[]> {
    return await this.userDashboardQueryRepository.findPurchasedCourseUsers(
      where,
    );
  }
}
