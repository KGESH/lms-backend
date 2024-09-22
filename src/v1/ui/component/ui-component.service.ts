import { Injectable } from '@nestjs/common';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { UiComponentRepository } from '@src/v1/ui/component/ui-component.repository';
import { IUiComponentBase } from '@src/v1/ui/component/ui-component.interface';
import { UiComponentQueryRepository } from '@src/v1/ui/component/ui-component-query.repository';
import { IUiComponentGroup } from '@src/v1/ui/component/ui-component-group.interface';

@Injectable()
export class UiComponentService {
  constructor(
    private readonly uiComponentRepository: UiComponentRepository,
    private readonly uiComponentQueryRepository: UiComponentQueryRepository,
  ) {}

  async getUiComponentsByPath(
    where: Pick<IUiComponentBase, 'path'>,
  ): Promise<IUiComponentGroup> {
    return await this.uiComponentQueryRepository.getUiComponentsByPath(where);
  }

  async deleteUiComponent(
    where: Pick<IUiComponentBase, 'id'>,
    tx?: TransactionClient,
  ): Promise<IUiComponentBase> {
    return await this.uiComponentRepository.delete(where, tx);
  }
}
