import { Module } from '@nestjs/common';
import { CourseDashboardController } from '@src/v1/dashboard/course/course-dashboard.controller';
import { CourseDashboardService } from '@src/v1/dashboard/course/course-dashboard.service';
import { CourseDashboardRepository } from '@src/v1/dashboard/course/course-dashboard.repository';
import { LessonContentModule } from '@src/v1/course/chapter/lesson/lesson-content/lesson-content.module';

const modules = [LessonContentModule];

const providers = [CourseDashboardService, CourseDashboardRepository];

@Module({
  imports: [...modules],
  controllers: [CourseDashboardController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class CourseDashboardModule {}
