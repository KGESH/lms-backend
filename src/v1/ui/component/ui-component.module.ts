import { Module } from '@nestjs/common';
import { UiComponentService } from '@src/v1/ui/component/ui-component.service';
import { UiComponentRepository } from '@src/v1/ui/component/ui-component.repository';
import { UiComponentController } from '@src/v1/ui/component/ui-component.controller';
import { UiComponentQueryRepository } from '@src/v1/ui/component/ui-component-query.repository';

const providers = [
  UiComponentService,
  UiComponentRepository,
  UiComponentQueryRepository,
];

@Module({
  controllers: [UiComponentController],
  providers: [...providers],
  exports: [...providers],
})
export class UiComponentModule {}
