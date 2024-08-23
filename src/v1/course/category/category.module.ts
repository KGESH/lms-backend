import { Module } from '@nestjs/common';
import { CategoryService } from '@src/v1/course/category/category.service';
import { CategoryRepository } from '@src/v1/course/category/category.repository';
import { CategoryController } from '@src/v1/course/category/category.controller';

const providers = [CategoryService, CategoryRepository];

@Module({
  controllers: [CategoryController],
  providers: [...providers],
  exports: [...providers],
})
export class CategoryModule {}
