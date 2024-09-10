import { Injectable } from '@nestjs/common';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { UiComponentRepository } from '@src/v1/ui/component/ui-component.repository';
import {
  IUiComponentBase,
  IUiComponentGroup,
} from '@src/v1/ui/component/ui-component.interface';
import { UiComponentQueryRepository } from '@src/v1/ui/component/ui-component-query.repository';
import {
  UiCarouselType,
  UiCategory,
} from '@src/v1/ui/category/ui-category.interface';
import { IUiRepeatTimerComponent } from '@src/v1/ui/component/repeat-timer/ui-repeat-timer.interface';
import { IUiCarouselComponent } from '@src/v1/ui/component/carousel/ui-carousel.interface';

@Injectable()
export class UiComponentService {
  constructor(
    private readonly uiComponentRepository: UiComponentRepository,
    private readonly uiComponentQueryRepository: UiComponentQueryRepository,
  ) {}

  async getUiComponentsByPath(where: Pick<IUiComponentBase, 'path'>): Promise<
    IUiComponentGroup<
      UiCategory,
      IUiRepeatTimerComponent[] | IUiCarouselComponent<UiCarouselType>[]
      // | IUiComponent<'banner', unknown>
      // | IUiComponent<'marketing-banner', unknown>
      // | IUiComponent<'carousel', unknown>
    >
  > {
    return await this.uiComponentQueryRepository.getUiComponentsByPath(where);
  }

  async deleteUiComponent(
    where: Pick<IUiComponentBase, 'id'>,
    tx?: TransactionClient,
  ): Promise<IUiComponentBase> {
    return await this.uiComponentRepository.delete(where, tx);
  }
}
