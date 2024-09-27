import { Module } from '@nestjs/common';
import { CourseDashboardModule } from '@src/v1/dashboard/course/course-dashboard.module';
import { UserDashboardModule } from '@src/v1/dashboard/user/user-dashboard.module';
import { PromotionDashboardModule } from '@src/v1/dashboard/promotion/promotion-dashboard.module';

const modules = [
  CourseDashboardModule,
  UserDashboardModule,
  PromotionDashboardModule,
];

@Module({
  imports: [...modules],
  exports: [...modules],
})
export class DashboardModule {}
