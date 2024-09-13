import { Module } from '@nestjs/common';
import { UiCarouselComponentRepository } from '@src/v1/ui/component/carousel/ui-carousel-component.repository';
import { UiCarouselComponentQueryRepository } from '@src/v1/ui/component/carousel/ui-carousel-component-query.repository';

const providers = [
  UiCarouselComponentRepository,
  UiCarouselComponentQueryRepository,
];

@Module({
  providers: [...providers],
  exports: [...providers],
})
export class UiCarouselModule {}
