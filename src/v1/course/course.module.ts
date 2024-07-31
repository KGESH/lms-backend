import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { CourseQueryRepository } from './course-query.repository';
import { CourseQueryService } from './course-query.service';
import { CourseRepository } from './course.repository';
import { LessonModule } from './lesson/lesson.module';

const providers = [
  CourseService,
  CourseQueryService,
  CourseRepository,
  CourseQueryRepository,
];

@Module({
  imports: [LessonModule],
  controllers: [CourseController],
  providers: [...providers],
  exports: [...providers, LessonModule],
})
export class CourseModule {}
