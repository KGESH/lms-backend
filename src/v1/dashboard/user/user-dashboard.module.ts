import { Module } from '@nestjs/common';
import { UserDashboardController } from '@src/v1/dashboard/user/user-dashboard.controller';
import { UserDashboardService } from '@src/v1/dashboard/user/user-dashboard.service';
import { UserDashboardQueryRepository } from '@src/v1/dashboard/user/user-dashboard-query.repository';
import { UserCourseEnrollmentModule } from '@src/v1/user/course/enrollment/user-course-enrollment.module';
import { UserModule } from '@src/v1/user/user.module';

const modules = [UserModule, UserCourseEnrollmentModule];

const providers = [UserDashboardService, UserDashboardQueryRepository];

@Module({
  imports: [...modules],
  controllers: [UserDashboardController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class UserDashboardModule {}
