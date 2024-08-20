import { Injectable } from '@nestjs/common';
import { UiComponentRepository } from './ui-component.repository';
import { IUiComponentBase } from './ui-component.interface';
import { TransactionClient } from '../../../infra/db/drizzle.types';
import { UiComponentQueryRepository } from './ui-component-query.repository';

@Injectable()
export class UiComponentService {
  constructor(
    private readonly uiComponentRepository: UiComponentRepository,
    private readonly uiComponentQueryRepository: UiComponentQueryRepository,
  ) {}

  async getUiComponentsByPath(where: Pick<IUiComponentBase, 'path'>) {
    return await this.uiComponentQueryRepository.getUiComponentsByPath(where);
  }

  async deleteUiComponent(
    where: Pick<IUiComponentBase, 'id'>,
    tx?: TransactionClient,
  ): Promise<IUiComponentBase> {
    return await this.uiComponentRepository.delete(where, tx);
  }
}
