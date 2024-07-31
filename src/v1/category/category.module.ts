import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';
import { CategoryController } from './category.controller';

const providers = [CategoryService, CategoryRepository];

@Module({
  controllers: [CategoryController],
  providers: [...providers],
  exports: [...providers],
})
export class CategoryModule {}
