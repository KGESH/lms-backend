import { Module } from '@nestjs/common';
import { EbookContentController } from '@src/v1/ebook/ebook-content/ebook-content.controller';
import { EbookContentRepository } from '@src/v1/ebook/ebook-content/ebook-content.repository';
import { EbookContentService } from '@src/v1/ebook/ebook-content/ebook-content.service';
import { EbookModule } from '@src/v1/ebook/ebook.module';
import { EbookContentQueryRepository } from '@src/v1/ebook/ebook-content/ebook-content-query.repository';
import { EbookContentQueryService } from '@src/v1/ebook/ebook-content/ebook-content-query.service';
import { EbookContentHistoryRepository } from '@src/v1/ebook/ebook-content/history/ebook-content-history.repository';
import { EbookContentHistoryQueryRepository } from '@src/v1/ebook/ebook-content/history/ebook-content-history-query.repository';

const modules = [EbookModule];

const providers = [
  EbookContentService,
  EbookContentQueryService,
  EbookContentRepository,
  EbookContentQueryRepository,
  EbookContentHistoryRepository,
  EbookContentHistoryQueryRepository,
];

@Module({
  imports: [...modules],
  controllers: [EbookContentController],
  providers: [...providers],
  exports: [...providers, ...modules],
})
export class EbookContentModule {}
