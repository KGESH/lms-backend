import { Injectable } from '@nestjs/common';
import { UiComponentService } from '@src/v1/ui/component/ui-component.service';
import {
  IUiRepeatTimer,
  IUiRepeatTimerComponent,
  IUiRepeatTimerComponentCreate,
  IUiRepeatTimerComponentUpdate,
} from '@src/v1/ui/component/repeat-timer/ui-repeat-timer.interface';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { UiRepeatTimerComponentRepository } from '@src/v1/ui/component/repeat-timer/ui-repeat-timer-component.repository';
import { UiRepeatTimerComponentQueryRepository } from '@src/v1/ui/component/repeat-timer/ui-repeat-timer-component-query.repository';

@Injectable()
export class UiRepeatTimerService {
  constructor(
    private readonly uiComponentService: UiComponentService,
    private readonly uiRepeatTimerComponentRepository: UiRepeatTimerComponentRepository,
    private readonly uiRepeatTimerComponentQueryRepository: UiRepeatTimerComponentQueryRepository,
  ) {}

  async findUiRepeatTimer(
    where: Pick<IUiRepeatTimer, 'uiComponentId'>,
  ): Promise<IUiRepeatTimerComponent | null> {
    return await this.uiRepeatTimerComponentQueryRepository.findUiRepeatTimer(
      where,
    );
  }

  async createUiRepeatTimer(
    params: IUiRepeatTimerComponentCreate,
  ): Promise<IUiRepeatTimerComponent> {
    return await this.uiRepeatTimerComponentRepository.createRepeatTimer(
      params,
    );
  }

  async updateUiRepeatTimer(
    where: Pick<IUiRepeatTimerComponent['ui'], 'uiComponentId'>,
    params: IUiRepeatTimerComponentUpdate,
  ): Promise<IUiRepeatTimerComponent> {
    const { ui } =
      await this.uiRepeatTimerComponentQueryRepository.findUiRepeatTimerOrThrow(
        where,
      );

    return await this.uiRepeatTimerComponentRepository.updateRepeatTimer(
      {
        id: ui.id,
        uiComponentId: ui.uiComponentId,
      },
      params,
    );
  }

  async deleteUiRepeatTimer(
    where: Pick<IUiRepeatTimer, 'uiComponentId'>,
    tx?: TransactionClient,
  ): Promise<string> {
    const { ui } =
      await this.uiRepeatTimerComponentQueryRepository.findUiRepeatTimerOrThrow(
        where,
      );

    await this.uiComponentService.deleteUiComponent(
      { id: ui.uiComponentId },
      tx,
    );

    const deletedId = ui.id;
    return deletedId;
  }
}
