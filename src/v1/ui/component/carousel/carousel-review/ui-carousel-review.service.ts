import { Injectable } from '@nestjs/common';
import { UiCarouselReviewComponentRepository } from './ui-carousel-review-component.repository';
import {
  IUiCarouselReview,
  IUiCarouselReviewCreate,
  IUiCarouselReviewWithItems,
} from './ui-carousel-review.interface';
import { UiCarouselComponentRepository } from '../ui-carousel-component.repository';
import { TransactionClient } from '../../../../../infra/db/drizzle.types';
import {
  IUiCarouselComponent,
  IUiCarouselComponentCreate,
} from '../ui-carousel.interface';
import { DrizzleService } from '../../../../../infra/db/drizzle.service';
import { UiCarouselReview } from '../../../category/ui-category.interface';
import { UiCarouselReviewQueryRepository } from './ui-carousel-review-query.repository';

@Injectable()
export class UiCarouselReviewService {
  constructor(
    private readonly uiCarouselReviewComponentRepository: UiCarouselReviewComponentRepository,
    private readonly uiCarouselComponentRepository: UiCarouselComponentRepository<UiCarouselReview>,
    private readonly uiCarouselReviewQueryRepository: UiCarouselReviewQueryRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async getUiCarouselReviewWithItemsById(
    where: Pick<IUiCarouselReview, 'uiCarouselId'>,
  ): Promise<IUiCarouselReviewWithItems | null> {
    const carouselWithItems =
      await this.uiCarouselReviewQueryRepository.findCarouselReviewWithItems(
        where,
      );

    return carouselWithItems;
  }

  async createUiCarouselReviewItems(
    createManyParams: IUiCarouselReviewCreate[],
    tx?: TransactionClient,
  ): Promise<IUiCarouselReview[]> {
    return await this.uiCarouselReviewComponentRepository.createMany(
      createManyParams,
      tx,
    );
  }

  async createUiCarouselReview(
    carouselParams: IUiCarouselComponentCreate<UiCarouselReview>,
  ): Promise<IUiCarouselComponent<UiCarouselReview>> {
    const uiCarousel =
      await this.uiCarouselComponentRepository.create(carouselParams);

    return uiCarousel;
  }

  async deleteUiCarouselReviewItems(
    ids: IUiCarouselReview['id'][],
  ): Promise<IUiCarouselReview[]> {
    const deleted = await this.drizzle.db.transaction(async (tx) => {
      return await this.uiCarouselReviewComponentRepository.deleteMany(ids, tx);
    });

    return deleted;
  }
}
