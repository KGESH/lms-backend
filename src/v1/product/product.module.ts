import { Module } from '@nestjs/common';
import { CourseProductModule } from './course-product/course-product.module';

@Module({
  imports: [CourseProductModule],
  exports: [CourseProductModule],
})
export class ProductModule {}
