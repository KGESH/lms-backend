import { Injectable } from '@nestjs/common';
import { UiComponentService } from '@src/v1/ui/component/ui-component.service';
import {
  IUiBanner,
  IUiBannerComponent,
  IUiBannerComponentCreate,
  IUiBannerComponentUpdate,
} from '@src/v1/ui/component/banner/ui-banner.interface';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { UiBannerComponentRepository } from '@src/v1/ui/component/banner/ui-banner-component.repository';
import { UiBannerComponentQueryRepository } from '@src/v1/ui/component/banner/ui-banner-component-query.repository';

@Injectable()
export class UiBannerService {
  constructor(
    private readonly uiComponentService: UiComponentService,
    private readonly uiBannerComponentRepository: UiBannerComponentRepository,
    private readonly uiBannerComponentQueryRepository: UiBannerComponentQueryRepository,
  ) {}

  async findUiBanner(
    where: Pick<IUiBanner, 'uiComponentId'>,
  ): Promise<IUiBannerComponent | null> {
    return await this.uiBannerComponentQueryRepository.findUiBanner(where);
  }

  async createUiBanner(
    params: IUiBannerComponentCreate,
  ): Promise<IUiBannerComponent> {
    return await this.uiBannerComponentRepository.createBanner(params);
  }

  async updateUiBanner(
    where: Pick<IUiBannerComponent['ui'], 'uiComponentId'>,
    params: IUiBannerComponentUpdate,
  ): Promise<IUiBannerComponent> {
    const { ui } =
      await this.uiBannerComponentQueryRepository.findUiBannerOrThrow(where);

    return await this.uiBannerComponentRepository.updateBanner(
      {
        id: ui.id,
        uiComponentId: ui.uiComponentId,
      },
      params,
    );
  }

  async deleteUiBanner(
    where: Pick<IUiBanner, 'uiComponentId'>,
    tx?: TransactionClient,
  ): Promise<string> {
    const { ui } =
      await this.uiBannerComponentQueryRepository.findUiBannerOrThrow(where);

    await this.uiComponentService.deleteUiComponent(
      { id: ui.uiComponentId },
      tx,
    );

    const deletedId = ui.id;
    return deletedId;
  }
}
