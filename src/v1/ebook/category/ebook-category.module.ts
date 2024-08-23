import { Module } from '@nestjs/common';
import { EbookCategoryService } from '@src/v1/ebook/category/ebook-category.service';
import { EbookCategoryRepository } from '@src/v1/ebook/category/ebook-category.repository';
import { EbookCategoryController } from '@src/v1/ebook/category/ebook-category.controller';
import { EbookCategoryQueryRepository } from '@src/v1/ebook/category/ebook-category-query.repository';

const providers = [
  EbookCategoryService,
  EbookCategoryRepository,
  EbookCategoryQueryRepository,
];

@Module({
  controllers: [EbookCategoryController],
  providers: [...providers],
  exports: [...providers],
})
export class EbookCategoryModule {}
