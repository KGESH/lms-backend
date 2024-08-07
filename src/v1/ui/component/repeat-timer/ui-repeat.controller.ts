import { Controller, Logger } from '@nestjs/common';
import { UiRepeatTimerService } from './ui-repeat-timer.service';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Uuid } from '../../../../shared/types/primitive';
import { IResponse } from '../../../../shared/types/response';
import {
  CreateUiRepeatTimerDto,
  DeletedUiRepeatTimerDto,
  UiRepeatTimerDto,
  UpdateUiRepeatTimerDto,
} from './ui-repeat-timer.dto';

@Controller('v1/ui/component/repeat-timer')
export class UiRepeatTimerController {
  private readonly logger = new Logger(UiRepeatTimerController.name);

  constructor(private readonly uiRepeatTimerService: UiRepeatTimerService) {}

  @TypedRoute.Get('/:id')
  async getUiRepeatTimer(
    @TypedParam('id') id: Uuid,
  ): Promise<IResponse<UiRepeatTimerDto | null>> {
    const uiRepeatTimer = await this.uiRepeatTimerService.findUiRepeatTimer({
      id,
    });
    return { data: uiRepeatTimer };
  }

  @TypedRoute.Post('/')
  async createUiRepeatTimer(
    @TypedBody() body: CreateUiRepeatTimerDto,
  ): Promise<IResponse<UiRepeatTimerDto>> {
    const uiRepeatTimer = await this.uiRepeatTimerService.createUiRepeatTimer({
      ...body,
      ui: {
        ...body.ui,
      },
    });
    return { data: uiRepeatTimer };
  }

  @TypedRoute.Patch('/:id')
  async updateUiRepeatTimer(
    @TypedParam('id') id: Uuid,
    @TypedBody() body: UpdateUiRepeatTimerDto,
  ): Promise<IResponse<UiRepeatTimerDto>> {
    const updated = await this.uiRepeatTimerService.updateUiRepeatTimer(
      { id },
      body,
    );
    return { data: updated };
  }

  @TypedRoute.Delete('/:id')
  async deleteUiRepeatTimer(
    @TypedParam('id') id: Uuid,
  ): Promise<IResponse<DeletedUiRepeatTimerDto>> {
    const deletedId = await this.uiRepeatTimerService.deleteUiRepeatTimer({
      id,
    });

    const dto: DeletedUiRepeatTimerDto = {
      id: deletedId,
    };
    return { data: dto };
  }
}
