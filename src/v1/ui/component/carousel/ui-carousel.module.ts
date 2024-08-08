import { Module } from '@nestjs/common';
import { UiCarouselComponentRepository } from './ui-carousel-component.repository';

const providers = [UiCarouselComponentRepository];

@Module({
  providers: [...providers],
  exports: [...providers],
})
export class UiCarouselModule {}
