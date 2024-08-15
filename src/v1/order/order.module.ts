import { Module } from '@nestjs/common';
import { CourseOrderModule } from './course/course-order.module';

@Module({
  imports: [CourseOrderModule],
  exports: [CourseOrderModule],
})
export class OrderModule {}
