import { Module } from '@nestjs/common';
import { UiCarouselContentQueryRepository } from '@src/v1/ui/component/carousel/carousel-content/ui-carousel-content-query.repository';
import { UiCarouselContentService } from '@src/v1/ui/component/carousel/carousel-content/ui-carousel-content.service';
import { UiCarouselContentRepository } from '@src/v1/ui/component/carousel/carousel-content/ui-carousel-content.repository';

const modules = [];

const providers = [
  UiCarouselContentService,
  UiCarouselContentRepository,
  UiCarouselContentQueryRepository,
];

@Module({
  imports: [...modules],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class UiCarouselContentModule {}
