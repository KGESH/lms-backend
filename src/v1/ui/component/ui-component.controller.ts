import { Controller } from '@nestjs/common';
import { UiComponentService } from './ui-component.service';
import { TypedParam, TypedRoute } from '@nestia/core';
import { Uuid } from '../../../shared/types/primitive';
import { IUiComponentBase } from './ui-component.interface';

@Controller('v1/ui/component')
export class UiComponentController {
  constructor(private readonly uiComponentService: UiComponentService) {}

  @TypedRoute.Delete('/:id')
  async deleteUiComponent(
    @TypedParam('id') id: Uuid,
  ): Promise<IUiComponentBase> {
    const deleted = await this.uiComponentService.deleteUiComponent({ id });
    return deleted;
  }
}
