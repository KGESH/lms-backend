import { Module } from '@nestjs/common';
import { UiCraftRepository } from '@src/v1/ui/craft/ui-craft.repository';
import { UiCraftQueryRepository } from '@src/v1/ui/craft/ui-craft-query.repository';
import { UiCraftController } from '@src/v1/ui/craft/ui-craft.controller';
import { UiCraftService } from '@src/v1/ui/craft/ui-craft.service';

const modules = [];

const providers = [UiCraftService, UiCraftRepository, UiCraftQueryRepository];

@Module({
  imports: [...modules],
  controllers: [UiCraftController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class UiCraftModule {}
