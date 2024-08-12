import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { CourseQueryRepository } from './course-query.repository';
import { CourseQueryService } from './course-query.service';
import { CourseRepository } from './course.repository';
import { TeacherModule } from '../teacher/teacher.module';

const providers = [
  CourseService,
  CourseQueryService,
  CourseRepository,
  CourseQueryRepository,
];

@Module({
  imports: [TeacherModule],
  controllers: [CourseController],
  providers: [...providers],
  exports: [...providers],
})
export class CourseModule {}
