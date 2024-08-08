import { Controller } from '@nestjs/common';
import { UiComponentService } from './ui-component.service';
import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Uuid } from '../../../shared/types/primitive';
import { IUiComponentBase, IUiComponentQuery } from './ui-component.interface';

@Controller('v1/ui/component')
export class UiComponentController {
  constructor(private readonly uiComponentService: UiComponentService) {}

  @TypedRoute.Get('/')
  async getUiComponentsByPath(
    @TypedQuery() query: IUiComponentQuery,
  ): Promise<unknown> {
    const uiComponents = await this.uiComponentService.getUiComponentsByPath({
      path: query.path,
    });
    return uiComponents;
  }

  @TypedRoute.Delete('/:id')
  async deleteUiComponent(
    @TypedParam('id') id: Uuid,
  ): Promise<IUiComponentBase> {
    const deleted = await this.uiComponentService.deleteUiComponent({ id });
    return deleted;
  }
}
