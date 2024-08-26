import { Module } from '@nestjs/common';
import { CourseProductModule } from '@src/v1/product/course-product/course-product.module';
import { EbookProductModule } from '@src/v1/product/ebook-product/ebook-product.module';

const modules = [CourseProductModule, EbookProductModule];

@Module({
  imports: [...modules],
  exports: [...modules],
})
export class ProductModule {}
