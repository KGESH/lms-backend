import { Injectable } from '@nestjs/common';
import { UiComponentRepository } from './ui-component.repository';
import {
  IUiComponentBase,
  IUiComponentBaseCreate,
  IUiComponentBaseUpdate,
} from './ui-component.interface';
import { TransactionClient } from '../../../infra/db/drizzle.types';

@Injectable()
export class UiComponentService {
  constructor(private readonly uiComponentRepository: UiComponentRepository) {}

  async createUiComponent(
    params: IUiComponentBaseCreate,
    tx?: TransactionClient,
  ): Promise<IUiComponentBase> {
    return await this.uiComponentRepository.create(params, tx);
  }

  async updateUiComponent(
    where: Pick<IUiComponentBase, 'id'>,
    params: IUiComponentBaseUpdate,
    tx?: TransactionClient,
  ): Promise<IUiComponentBase> {
    return await this.uiComponentRepository.update(where, params, tx);
  }

  async deleteUiComponent(
    where: Pick<IUiComponentBase, 'id'>,
    tx?: TransactionClient,
  ): Promise<IUiComponentBase> {
    return await this.uiComponentRepository.delete(where, tx);
  }
}
