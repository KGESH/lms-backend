import { Injectable } from '@nestjs/common';
import { UiComponentService } from '@src/v1/ui/component/ui-component.service';
import {
  IUiPopup,
  IUiPopupComponent,
  IUiPopupComponentCreate,
  IUiPopupComponentUpdate,
} from '@src/v1/ui/component/popup/ui-popup.interface';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { UiPopupComponentRepository } from '@src/v1/ui/component/popup/ui-popup-component.repository';
import { UiPopupComponentQueryRepository } from '@src/v1/ui/component/popup/ui-popup-component-query.repository';
import { Paginated, Pagination } from '@src/shared/types/pagination';

@Injectable()
export class UiPopupService {
  constructor(
    private readonly uiComponentService: UiComponentService,
    private readonly uiPopupComponentRepository: UiPopupComponentRepository,
    private readonly uiPopupComponentQueryRepository: UiPopupComponentQueryRepository,
  ) {}

  async findUiPopups(
    query: Pagination,
  ): Promise<Paginated<IUiPopupComponent[]>> {
    return await this.uiPopupComponentQueryRepository.findManyUiPopups(query);
  }

  async findUiPopup(
    where: Pick<IUiPopup, 'uiComponentId'>,
  ): Promise<IUiPopupComponent | null> {
    return await this.uiPopupComponentQueryRepository.findUiPopup(where);
  }

  async createUiPopup(
    params: IUiPopupComponentCreate,
  ): Promise<IUiPopupComponent> {
    return await this.uiPopupComponentRepository.createPopup(params);
  }

  async updateUiPopup(
    where: Pick<IUiPopupComponent['ui'], 'uiComponentId'>,
    params: IUiPopupComponentUpdate,
  ): Promise<IUiPopupComponent> {
    const { ui } =
      await this.uiPopupComponentQueryRepository.findUiPopupOrThrow(where);

    return await this.uiPopupComponentRepository.updatePopup(
      {
        id: ui.id,
        uiComponentId: ui.uiComponentId,
      },
      params,
    );
  }

  async deleteUiPopup(
    where: Pick<IUiPopup, 'uiComponentId'>,
    tx?: TransactionClient,
  ): Promise<string> {
    const { ui } =
      await this.uiPopupComponentQueryRepository.findUiPopupOrThrow(where);

    await this.uiComponentService.deleteUiComponent(
      { id: ui.uiComponentId },
      tx,
    );

    const deletedId = ui.id;
    return deletedId;
  }
}
