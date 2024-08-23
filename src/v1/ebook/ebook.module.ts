import { Module } from '@nestjs/common';
import { EbookCategoryModule } from '@src/v1/ebook/category/ebook-category.module';

const modules = [EbookCategoryModule];

const providers = [];

@Module({
  imports: [...modules],
  controllers: [],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class EbookModule {}
