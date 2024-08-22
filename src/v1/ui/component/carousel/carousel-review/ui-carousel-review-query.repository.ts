import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IUiCarouselReview,
  IUiCarouselReviewWithItems,
} from './ui-carousel-review.interface';
import {
  UiCarousel,
  UiCarouselReview,
} from '@src/v1/ui/category/ui-category.interface';

@Injectable()
export class UiCarouselReviewQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findCarouselReviewWithItems(
    where: Pick<IUiCarouselReview, 'uiCarouselId'>,
  ): Promise<IUiCarouselReviewWithItems | null> {
    const carouselWithItems = await this.drizzle.db.query.uiCarousels.findFirst(
      {
        where: eq(dbSchema.uiCarousels.id, where.uiCarouselId),
        with: {
          uiComponent: true,
          reviews: true,
        },
      },
    );

    if (!carouselWithItems) {
      return null;
    }

    return {
      uiCarousel: {
        ...carouselWithItems.uiComponent,
        category: carouselWithItems.uiComponent.category as UiCarousel,
        ui: {
          ...carouselWithItems,
          carouselType: carouselWithItems.carouselType as UiCarouselReview,
        },
      },
      uiCarouselReviewItems: carouselWithItems.reviews.map((review) => ({
        id: review.id,
        uiCarouselId: review.uiCarouselId,
        sequence: review.sequence,
        title: review.title,
        content: review.content,
        rating: review.rating,
      })),
    };
  }
}
