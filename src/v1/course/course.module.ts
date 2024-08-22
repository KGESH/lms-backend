import { Module } from '@nestjs/common';
import { TeacherModule } from '@src/v1/teacher/teacher.module';
import { CategoryModule } from '@src/v1/category/category.module';
import { CourseController } from '@src/v1/course/course.controller';
import { CourseService } from '@src/v1/course/course.service';
import { CourseQueryRepository } from '@src/v1/course/course-query.repository';
import { CourseQueryService } from '@src/v1/course/course-query.service';
import { CourseRepository } from '@src/v1/course/course.repository';

const modules = [CategoryModule, TeacherModule];

const providers = [
  CourseService,
  CourseQueryService,
  CourseRepository,
  CourseQueryRepository,
];

@Module({
  imports: [...modules],
  controllers: [CourseController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class CourseModule {}
