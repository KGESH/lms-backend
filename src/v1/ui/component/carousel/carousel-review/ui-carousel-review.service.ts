import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { UiCarouselReviewComponentRepository } from '@src/v1/ui/component/carousel/carousel-review/ui-carousel-review-component.repository';
import {
  IUiCarouselReview,
  IUiCarouselReviewCreate,
  IUiCarouselReviewUpdate,
  IUiCarouselReviewWithItems,
} from '@src/v1/ui/component/carousel/carousel-review/ui-carousel-review.interface';
import { UiCarouselComponentRepository } from '@src/v1/ui/component/carousel/ui-carousel-component.repository';
import {
  IUiCarouselComponent,
  IUiCarouselComponentCreate,
} from '@src/v1/ui/component/carousel/ui-carousel.interface';
import { UiCarouselReviewQueryRepository } from '@src/v1/ui/component/carousel/carousel-review/ui-carousel-review-query.repository';
import { UiCarouselReview } from '@src/v1/ui/category/ui-category.interface';
import { RequiredField } from '@src/shared/types/required-field';
import { UiCarouselComponentQueryRepository } from '@src/v1/ui/component/carousel/ui-carousel-component-query.repository';

@Injectable()
export class UiCarouselReviewService {
  constructor(
    private readonly uiCarouselReviewComponentRepository: UiCarouselReviewComponentRepository,
    private readonly uiCarouselReviewComponentQueryRepository: UiCarouselComponentQueryRepository<UiCarouselReview>,
    private readonly uiCarouselComponentRepository: UiCarouselComponentRepository<UiCarouselReview>,
    private readonly uiCarouselReviewQueryRepository: UiCarouselReviewQueryRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async findUiCarouselReviewWithItems(
    where: Pick<IUiCarouselComponent<UiCarouselReview>['ui'], 'uiComponentId'>,
  ): Promise<IUiCarouselReviewWithItems | null> {
    const carouselWithItems =
      await this.uiCarouselReviewQueryRepository.findCarouselReviewWithItems(
        where,
      );

    return carouselWithItems;
  }

  async createUiCarouselReview(
    carouselParams: IUiCarouselComponentCreate<UiCarouselReview>,
  ): Promise<IUiCarouselComponent<UiCarouselReview>> {
    const uiCarousel =
      await this.uiCarouselComponentRepository.createUiCarouselComponent(
        carouselParams,
      );

    return uiCarousel;
  }

  async createUiCarouselReviewItems(
    where: Pick<IUiCarouselComponent<UiCarouselReview>['ui'], 'uiComponentId'>,
    createManyParams: Omit<IUiCarouselReviewCreate, 'uiCarouselId'>[],
    tx?: TransactionClient,
  ): Promise<IUiCarouselReview[]> {
    const carousel =
      await this.uiCarouselReviewComponentQueryRepository.findUiCarousel(where);

    if (!carousel) {
      throw new NotFoundException('UI Review carousel not found.');
    }

    return await this.uiCarouselReviewComponentRepository.createMany(
      createManyParams.map((params) => ({
        ...params,
        uiCarouselId: carousel.ui.id,
      })),
      tx,
    );
  }

  async updateUiCarouselReviewItems(
    updateParams: RequiredField<IUiCarouselReviewUpdate, 'id'>[],
  ): Promise<IUiCarouselReview[]> {
    const updatedReviews = await this.drizzle.db.transaction(async (tx) => {
      return await Promise.all(
        updateParams.map((params) =>
          this.uiCarouselReviewComponentRepository.updateUiCarouselReview(
            { id: params.id },
            params,
            tx,
          ),
        ),
      );
    });

    return updatedReviews;
  }

  async deleteUiCarouselReviewItems(
    ids: IUiCarouselReview['id'][],
  ): Promise<IUiCarouselReview[]> {
    const deleted = await this.drizzle.db.transaction(async (tx) => {
      return await this.uiCarouselReviewComponentRepository.deleteManyUiCarouselReviews(
        ids,
        tx,
      );
    });

    return deleted;
  }
}
