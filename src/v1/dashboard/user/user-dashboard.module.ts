import { Module } from '@nestjs/common';
import { UserDashboardController } from '@src/v1/dashboard/user/user-dashboard.controller';
import { UserDashboardService } from '@src/v1/dashboard/user/user-dashboard.service';
import { UserDashboardQueryRepository } from '@src/v1/dashboard/user/user-dashboard-query.repository';

const modules = [];

const providers = [UserDashboardService, UserDashboardQueryRepository];

@Module({
  imports: [...modules],
  controllers: [UserDashboardController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class UserDashboardModule {}
