import { Injectable } from '@nestjs/common';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { UiComponentRepository } from '@src/v1/ui/component/ui-component.repository';
import { IUiComponentBase } from '@src/v1/ui/component/ui-component.interface';
import { UiComponentQueryRepository } from '@src/v1/ui/component/ui-component-query.repository';
import { IUiComponents } from '@src/v1/ui/component/ui-component-group.interface';
import { Uuid } from '@src/shared/types/primitive';

@Injectable()
export class UiComponentService {
  constructor(
    private readonly uiComponentRepository: UiComponentRepository,
    private readonly uiComponentQueryRepository: UiComponentQueryRepository,
  ) {}

  async getUiComponentsByPath(
    where: Pick<IUiComponentBase, 'path'>,
  ): Promise<IUiComponents> {
    return await this.uiComponentQueryRepository.getUiComponentsByPath(where);
  }

  async deleteUiComponent(
    where: Pick<IUiComponentBase, 'id'>,
    tx?: TransactionClient,
  ): Promise<Uuid> {
    return await this.uiComponentRepository.deleteUiComponent(where, tx);
  }
}
