import { Module } from '@nestjs/common';
import { CourseDashboardController } from '@src/v1/dashboard/course/course-dashboard.controller';
import { CourseDashboardService } from '@src/v1/dashboard/course/course-dashboard.service';
import { CourseDashboardRepository } from '@src/v1/dashboard/course/course-dashboard.repository';

const modules = [];

const providers = [CourseDashboardService, CourseDashboardRepository];

@Module({
  imports: [...modules],
  controllers: [CourseDashboardController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class CourseDashboardModule {}
