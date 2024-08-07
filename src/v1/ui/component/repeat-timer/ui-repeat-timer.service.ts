import { Injectable } from '@nestjs/common';
import {
  IUiRepeatTimer,
  IUiRepeatTimerComponent,
  IUiRepeatTimerComponentCreate,
  IUiRepeatTimerComponentUpdate,
} from './ui-repeat-timer.interface';
import { TransactionClient } from '../../../../infra/db/drizzle.types';
import { UiComponentService } from '../ui-component.service';
import { UiRepeatTimerComponentRepository } from './ui-repeat-timer-component.repository';

@Injectable()
export class UiRepeatTimerService {
  constructor(
    private readonly uiComponentService: UiComponentService,
    private readonly uiRepeatTimerComponentRepository: UiRepeatTimerComponentRepository,
  ) {}

  async findUiRepeatTimer(
    where: Pick<IUiRepeatTimer, 'id'>,
  ): Promise<IUiRepeatTimerComponent | null> {
    return await this.uiRepeatTimerComponentRepository.findOne({
      id: where.id,
    });
  }

  async createUiRepeatTimer(
    params: IUiRepeatTimerComponentCreate,
  ): Promise<IUiRepeatTimerComponent> {
    return await this.uiRepeatTimerComponentRepository.create(params);
  }

  async updateUiRepeatTimer(
    where: Pick<IUiRepeatTimerComponent['ui'], 'id'>,
    params: IUiRepeatTimerComponentUpdate,
  ): Promise<IUiRepeatTimerComponent> {
    const { ui } = await this.uiRepeatTimerComponentRepository.findOneOrThrow({
      id: where.id,
    });

    return await this.uiRepeatTimerComponentRepository.update(
      {
        id: ui.id,
        uiComponentId: ui.uiComponentId,
      },
      params,
    );
  }

  async deleteUiRepeatTimer(
    where: Pick<IUiRepeatTimer, 'id'>,
    tx?: TransactionClient,
  ): Promise<string> {
    const { ui } = await this.uiRepeatTimerComponentRepository.findOneOrThrow({
      id: where.id,
    });

    await this.uiComponentService.deleteUiComponent(
      { id: ui.uiComponentId },
      tx,
    );

    const deletedId = ui.id;
    return deletedId;
  }
}
