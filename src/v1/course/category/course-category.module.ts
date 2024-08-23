import { Module } from '@nestjs/common';
import { CourseCategoryService } from '@src/v1/course/category/course-category.service';
import { CourseCategoryRepository } from '@src/v1/course/category/course-category.repository';
import { CourseCategoryController } from '@src/v1/course/category/course-category.controller';
import { CourseCategoryQueryRepository } from '@src/v1/course/category/course-category-query.repository';

const providers = [
  CourseCategoryService,
  CourseCategoryRepository,
  CourseCategoryQueryRepository,
];

@Module({
  controllers: [CourseCategoryController],
  providers: [...providers],
  exports: [...providers],
})
export class CourseCategoryModule {}
