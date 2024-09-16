import { Module } from '@nestjs/common';
import { EbookReviewService } from '@src/v1/review/ebook-review/ebook-review.service';
import { EbookReviewController } from '@src/v1/review/ebook-review/ebook-review.controller';
import { ReviewModule } from '@src/v1/review/review.module';
import { EbookReviewRepository } from '@src/v1/review/ebook-review/ebook-review.repository';
import { EbookReviewAdminService } from '@src/v1/review/admin/ebook/ebook-review-admin.service';
import { MockEbookReviewQueryRepository } from '@src/v1/review/mock-review/mock-ebook-review-query.repository';
import { EbookReviewAdminController } from '@src/v1/review/admin/ebook/ebook-review-admin.controller';
import { MockReviewRepository } from '@src/v1/review/mock-review/mock-review.repository';

const modules = [ReviewModule];

const providers = [
  EbookReviewService,
  EbookReviewAdminService,
  EbookReviewRepository,
  MockReviewRepository,
  MockEbookReviewQueryRepository,
];

@Module({
  imports: [...modules],
  controllers: [EbookReviewController, EbookReviewAdminController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class EbookReviewModule {}
