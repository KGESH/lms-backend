import { Injectable } from '@nestjs/common';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { UiCarouselReviewComponentRepository } from '@src/v1/ui/component/carousel/carousel-review/ui-carousel-review-component.repository';
import {
  IUiCarouselReview,
  IUiCarouselReviewCreate,
  IUiCarouselReviewWithItems,
} from '@src/v1/ui/component/carousel/carousel-review/ui-carousel-review.interface';
import { UiCarouselComponentRepository } from '@src/v1/ui/component/carousel/ui-carousel-component.repository';
import {
  IUiCarouselComponent,
  IUiCarouselComponentCreate,
} from '@src/v1/ui/component/carousel/ui-carousel.interface';
import { UiCarouselReviewQueryRepository } from '@src/v1/ui/component/carousel/carousel-review/ui-carousel-review-query.repository';
import { UiCarouselReview } from '@src/v1/ui/category/ui-category.interface';

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
