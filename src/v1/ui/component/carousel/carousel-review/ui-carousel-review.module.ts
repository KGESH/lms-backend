import { Module } from '@nestjs/common';
import { UiCarouselModule } from '@src/v1/ui/component/carousel/ui-carousel.module';
import { UiCarouselReviewQueryRepository } from '@src/v1/ui/component/carousel/carousel-review/ui-carousel-review-query.repository';
import { UiCarouselReviewComponentRepository } from '@src/v1/ui/component/carousel/carousel-review/ui-carousel-review-component.repository';
import { UiCarouselReviewService } from '@src/v1/ui/component/carousel/carousel-review/ui-carousel-review.service';
import { UiCarouselReviewController } from '@src/v1/ui/component/carousel/carousel-review/ui-carousel-review.controller';

const modules = [UiCarouselModule];

const providers = [
  UiCarouselReviewService,
  UiCarouselReviewComponentRepository,
  UiCarouselReviewQueryRepository,
];

@Module({
  imports: [...modules],
  controllers: [UiCarouselReviewController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class UiCarouselReviewModule {}
