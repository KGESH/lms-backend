import { Module } from '@nestjs/common';
import { UiComponentModule } from '@src/v1/ui/component/ui-component.module';
import { UiBannerComponentQueryRepository } from '@src/v1/ui/component/banner/ui-banner-component-query.repository';
import { UiBannerController } from '@src/v1/ui/component/banner/ui-banner.controller';
import { UiBannerService } from '@src/v1/ui/component/banner/ui-banner.service';
import { UiBannerComponentRepository } from '@src/v1/ui/component/banner/ui-banner-component.repository';

const modules = [UiComponentModule];

const providers = [
  UiBannerService,
  UiBannerComponentRepository,
  UiBannerComponentQueryRepository,
];

@Module({
  imports: [...modules],
  controllers: [UiBannerController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class UiBannerModule {}
