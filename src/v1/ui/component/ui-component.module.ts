import { Module } from '@nestjs/common';
import { UiComponentService } from './ui-component.service';
import { UiComponentRepository } from './ui-component.repository';
import { UiComponentController } from './ui-component.controller';
import { UiComponentQueryRepository } from './ui-component-query.repository';

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
