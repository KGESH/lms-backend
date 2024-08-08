import { Module } from '@nestjs/common';
import { UiCarouselReviewQueryRepository } from './ui-carousel-review-query.repository';
import { UiCarouselModule } from '../ui-carousel.module';
import { UiCarouselReviewComponentRepository } from './ui-carousel-review-component.repository';
import { UiCarouselReviewService } from './ui-carousel-review.service';
import { UiCarouselReviewController } from './ui-carousel-review.controller';

const providers = [
  UiCarouselReviewService,
  UiCarouselReviewComponentRepository,
  UiCarouselReviewQueryRepository,
];

@Module({
  imports: [UiCarouselModule],
  controllers: [UiCarouselReviewController],
  providers: [...providers],
  exports: [...providers],
})
export class UiCarouselReviewModule {}
