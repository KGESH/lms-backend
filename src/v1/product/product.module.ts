import { Module } from '@nestjs/common';
import { CourseProductModule } from '@src/v1/product/course-product/course-product.module';

@Module({
  imports: [CourseProductModule],
  exports: [CourseProductModule],
})
export class ProductModule {}
