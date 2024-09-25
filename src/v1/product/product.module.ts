import { Module } from '@nestjs/common';
import { CourseProductModule } from '@src/v1/product/course-product/course-product.module';
import { EbookProductModule } from '@src/v1/product/ebook-product/ebook-product.module';
import { FileModule } from '@src/v1/file/file.module';

const modules = [CourseProductModule, EbookProductModule, FileModule];

@Module({
  imports: [...modules],
  exports: [...modules],
})
export class ProductModule {}
