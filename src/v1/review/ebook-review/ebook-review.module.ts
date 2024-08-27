import { Module } from '@nestjs/common';
import { EbookReviewService } from '@src/v1/review/ebook-review/ebook-review.service';
import { EbookReviewController } from '@src/v1/review/ebook-review/ebook-review.controller';
import { ReviewModule } from '@src/v1/review/review.module';
import { EbookReviewRepository } from '@src/v1/review/ebook-review/ebook-review.repository';
import { EbookReviewAdminService } from '@src/v1/review/ebook-review/ebook-review-admin.service';

const modules = [ReviewModule];

const providers = [
  EbookReviewService,
  EbookReviewAdminService,
  EbookReviewRepository,
];

@Module({
  imports: [...modules],
  controllers: [EbookReviewController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class EbookReviewModule {}
