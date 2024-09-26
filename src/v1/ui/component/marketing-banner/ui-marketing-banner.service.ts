import { Injectable } from '@nestjs/common';
import { UiComponentService } from '@src/v1/ui/component/ui-component.service';
import {
  IUiMarketingBanner,
  IUiMarketingBannerComponent,
  IUiMarketingBannerComponentCreate,
  IUiMarketingBannerComponentUpdate,
} from '@src/v1/ui/component/marketing-banner/ui-marketing-banner.interface';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { UiMarketingBannerComponentRepository } from '@src/v1/ui/component/marketing-banner/ui-marketing-banner-component.repository';
import { UiMarketingBannerComponentQueryRepository } from '@src/v1/ui/component/marketing-banner/ui-marketing-banner-component-query.repository';

@Injectable()
export class UiMarketingBannerService {
  constructor(
    private readonly uiComponentService: UiComponentService,
    private readonly uiMarketingBannerComponentRepository: UiMarketingBannerComponentRepository,
    private readonly uiMarketingBannerComponentQueryRepository: UiMarketingBannerComponentQueryRepository,
  ) {}

  async findUiMarketingBanner(
    where: Pick<IUiMarketingBanner, 'uiComponentId'>,
  ): Promise<IUiMarketingBannerComponent | null> {
    return await this.uiMarketingBannerComponentQueryRepository.findUiMarketingBanner(
      where,
    );
  }

  async createUiMarketingBanner(
    params: IUiMarketingBannerComponentCreate,
  ): Promise<IUiMarketingBannerComponent> {
    return await this.uiMarketingBannerComponentRepository.createMarketingBanner(
      params,
    );
  }

  async updateUiMarketingBanner(
    where: Pick<IUiMarketingBannerComponent['ui'], 'uiComponentId'>,
    params: IUiMarketingBannerComponentUpdate,
  ): Promise<IUiMarketingBannerComponent> {
    const { ui } =
      await this.uiMarketingBannerComponentQueryRepository.findUiMarketingBannerOrThrow(
        where,
      );

    return await this.uiMarketingBannerComponentRepository.updateMarketingBanner(
      {
        id: ui.id,
        uiComponentId: ui.uiComponentId,
      },
      params,
    );
  }

  async deleteUiMarketingBanner(
    where: Pick<IUiMarketingBanner, 'uiComponentId'>,
    tx?: TransactionClient,
  ): Promise<string> {
    const { ui } =
      await this.uiMarketingBannerComponentQueryRepository.findUiMarketingBannerOrThrow(
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
