import { Module } from '@nestjs/common';
import { UiCarouselModule } from '@src/v1/ui/component/carousel/ui-carousel.module';
import { UiCarouselMainBannerService } from '@src/v1/ui/component/carousel/carousel-main-banner/ui-carousel-main-banner.service';
import { UiCarouselMainBannerController } from '@src/v1/ui/component/carousel/carousel-main-banner/ui-carousel-main-banner.controller';
import { UiCarouselContentModule } from '@src/v1/ui/component/carousel/carousel-content/ui-carousel-content.module';
import { UiCarouselMainBannerQueryRepository } from '@src/v1/ui/component/carousel/carousel-main-banner/ui-carousel-main-banner-query.repository';

const modules = [UiCarouselModule, UiCarouselContentModule];

const providers = [
  UiCarouselMainBannerService,
  UiCarouselMainBannerQueryRepository,
];

@Module({
  imports: [...modules],
  controllers: [UiCarouselMainBannerController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class UiCarouselMainBannerModule {}
