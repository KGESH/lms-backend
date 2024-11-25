import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IUiCarouselReviewWithItems } from './ui-carousel-review.interface';
import {
  UiCarousel,
  UiCarouselReview,
} from '@src/v1/ui/category/ui-category.interface';
import { IUiCarouselComponent } from '@src/v1/ui/component/carousel/ui-carousel.interface';

@Injectable()
export class UiCarouselReviewQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findCarouselReviewWithItems(
    where: Pick<IUiCarouselComponent<UiCarouselReview>['ui'], 'uiComponentId'>,
  ): Promise<IUiCarouselReviewWithItems | null> {
    const uiComponentWithCarousel =
      await this.drizzle.db.query.uiComponents.findFirst({
        where: eq(dbSchema.uiComponents.id, where.uiComponentId),
        with: {
          carousel: {
            with: {
              reviews: true,
            },
          },
        },
      });

    if (!uiComponentWithCarousel?.carousel) {
      return null;
    }

    const { carousel, ...uiComponent } = uiComponentWithCarousel;
    return {
      uiCarousel: {
        ...uiComponent,
        category: uiComponent.category as UiCarousel,
        ui: {
          ...carousel,
          carouselType: carousel.carouselType as UiCarouselReview,
        },
      },
      uiCarouselReviewItems: carousel.reviews.map((review) => ({
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
