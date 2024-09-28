import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { UiCarouselContentRepository } from '@src/v1/ui/component/carousel/carousel-content/ui-carousel-content.repository';
import {
  IUiCarouselContent,
  IUiCarouselContentCreate,
  IUiCarouselContentUpdate,
} from '@src/v1/ui/component/carousel/carousel-content/ui-carousel-content.interface';
import { UiCarouselContentQueryRepository } from '@src/v1/ui/component/carousel/carousel-content/ui-carousel-content-query.repository';
import { TransactionClient } from '@src/infra/db/drizzle.types';

@Injectable()
export class UiCarouselContentService {
  constructor(
    private readonly uiCarouselContentRepository: UiCarouselContentRepository,
    private readonly uiCarouselContentQueryRepository: UiCarouselContentQueryRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async createUiCarouselContents(
    params: IUiCarouselContentCreate[],
    tx = this.drizzle.db,
  ): Promise<IUiCarouselContent[]> {
    if (params.length === 0) {
      return [];
    }

    const carouselContents =
      await this.uiCarouselContentRepository.createManyUiCarouselContents(
        params,
        tx,
      );

    return carouselContents;
  }

  async updateUiCarouselContent(
    where: Pick<IUiCarouselContent, 'id'>,
    params: Omit<IUiCarouselContentUpdate, 'id'>,
    tx: TransactionClient,
  ): Promise<IUiCarouselContent> {
    const exist =
      await this.uiCarouselContentQueryRepository.findUiCarouselContent(where);

    if (!exist) {
      throw new NotFoundException('Carousel content not found');
    }

    const updated =
      await this.uiCarouselContentRepository.updateUiCarouselContent(
        where,
        params,
        tx,
      );

    return updated;
  }

  async deleteUiCarouselContents(
    ids: IUiCarouselContent['id'][],
    tx = this.drizzle.db,
  ): Promise<IUiCarouselContent['id'][]> {
    const deletedIds =
      await this.uiCarouselContentRepository.deleteManyUiCarouselContents(
        ids,
        tx,
      );

    return deletedIds;
  }
}
