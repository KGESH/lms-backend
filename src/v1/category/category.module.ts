import { Module } from '@nestjs/common';
import { CategoryService } from '@src/v1/category/category.service';
import { CategoryRepository } from '@src/v1/category/category.repository';
import { CategoryController } from '@src/v1/category/category.controller';

const providers = [CategoryService, CategoryRepository];

@Module({
  controllers: [CategoryController],
  providers: [...providers],
  exports: [...providers],
})
export class CategoryModule {}
