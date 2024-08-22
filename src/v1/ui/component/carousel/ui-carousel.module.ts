import { Module } from '@nestjs/common';
import { UiCarouselComponentRepository } from '@src/v1/ui/component/carousel/ui-carousel-component.repository';

const providers = [UiCarouselComponentRepository];

@Module({
  providers: [...providers],
  exports: [...providers],
})
export class UiCarouselModule {}
