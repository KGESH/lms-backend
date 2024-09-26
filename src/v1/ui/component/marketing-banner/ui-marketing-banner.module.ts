import { Module } from '@nestjs/common';
import { UiComponentModule } from '@src/v1/ui/component/ui-component.module';
import { UiMarketingBannerComponentQueryRepository } from '@src/v1/ui/component/marketing-banner/ui-marketing-banner-component-query.repository';
import { UiMarketingBannerController } from '@src/v1/ui/component/marketing-banner/ui-marketing-banner.controller';
import { UiMarketingBannerService } from '@src/v1/ui/component/marketing-banner/ui-marketing-banner.service';
import { UiMarketingBannerComponentRepository } from '@src/v1/ui/component/marketing-banner/ui-marketing-banner-component.repository';

const modules = [UiComponentModule];

const providers = [
  UiMarketingBannerService,
  UiMarketingBannerComponentRepository,
  UiMarketingBannerComponentQueryRepository,
];

@Module({
  imports: [...modules],
  controllers: [UiMarketingBannerController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class UiMarketingBannerModule {}
