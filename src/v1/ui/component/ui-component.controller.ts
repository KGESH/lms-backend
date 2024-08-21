import { Controller, UseGuards } from '@nestjs/common';
import { UiComponentService } from './ui-component.service';
import { TypedHeaders, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Uuid } from '../../../shared/types/primitive';
import { SkipAuth } from '../../../core/decorators/skip-auth.decorator';
import { RolesGuard } from '../../../core/guards/roles.guard';
import { Roles } from '../../../core/decorators/roles.decorator';
import { UiComponentBaseDto, UiComponentQuery } from './ui-component.dto';
import { ApiAuthHeaders, AuthHeaders } from '../../auth/auth.headers';

@Controller('v1/ui/component')
export class UiComponentController {
  constructor(private readonly uiComponentService: UiComponentService) {}

  @SkipAuth()
  @TypedRoute.Get('/')
  async getUiComponentsByPath(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query: UiComponentQuery,
  ): Promise<unknown> {
    const uiComponents = await this.uiComponentService.getUiComponentsByPath({
      path: query.path,
    });
    return uiComponents;
  }

  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedRoute.Delete('/:id')
  async deleteUiComponent(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('id') id: Uuid,
  ): Promise<UiComponentBaseDto> {
    const deleted = await this.uiComponentService.deleteUiComponent({ id });
    return deleted;
  }
}
