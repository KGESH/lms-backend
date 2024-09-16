import { Module } from '@nestjs/common';
import { CourseDashboardModule } from '@src/v1/dashboard/course/course-dashboard.module';
import { UserDashboardModule } from '@src/v1/dashboard/user/user-dashboard.module';

const modules = [CourseDashboardModule, UserDashboardModule];

@Module({
  imports: [...modules],
  exports: [...modules],
})
export class DashboardModule {}
