import { Module } from '@nestjs/common';
import { UiComponentModule } from '@src/v1/ui/component/ui-component.module';
import { UiPopupComponentQueryRepository } from '@src/v1/ui/component/popup/ui-popup-component-query.repository';
import { UiPopupController } from '@src/v1/ui/component/popup/ui-popup.controller';
import { UiPopupService } from '@src/v1/ui/component/popup/ui-popup.service';
import { UiPopupComponentRepository } from '@src/v1/ui/component/popup/ui-popup-component.repository';

const modules = [UiComponentModule];

const providers = [
  UiPopupService,
  UiPopupComponentRepository,
  UiPopupComponentQueryRepository,
];

@Module({
  imports: [...modules],
  controllers: [UiPopupController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class UiPopupModule {}
