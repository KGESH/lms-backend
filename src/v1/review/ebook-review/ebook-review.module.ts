import { Module } from '@nestjs/common';
import { EbookReviewService } from '@src/v1/review/ebook-review/ebook-review.service';
import { EbookReviewController } from '@src/v1/review/ebook-review/ebook-review.controller';
import { ReviewModule } from '@src/v1/review/review.module';

const modules = [ReviewModule];

const providers = [EbookReviewService];

@Module({
  imports: [...modules],
  controllers: [EbookReviewController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class EbookReviewModule {}
