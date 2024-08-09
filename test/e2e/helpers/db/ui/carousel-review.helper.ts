import { dbSchema } from '../../../../../src/infra/db/schema';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import { IUiCarouselComponentCreate } from '../../../../../src/v1/ui/component/carousel/ui-carousel.interface';
import { UiCarouselReview } from '../../../../../src/v1/ui/category/ui-category.interface';
import { IUiCarouselReviewCreate } from '../../../../../src/v1/ui/component/carousel/carousel-review/ui-carousel-review.interface';
import * as typia from 'typia';

export const createCarouselReview = async (
  carouselParams: IUiCarouselComponentCreate<UiCarouselReview>,
  carouselItemParams: IUiCarouselReviewCreate[],
  db: TransactionClient,
) => {
  if (carouselItemParams.length <= 0) {
    throw new Error('Carousel review items must be provided');
  }

  const { ui: uiCreateParam, ...uiComponentCreateParam } = carouselParams;
  const [uiComponent] = await db
    .insert(dbSchema.uiComponents)
    .values(uiComponentCreateParam)
    .returning();
  const [carousel] = await db
    .insert(dbSchema.uiCarousels)
    .values({
      ...uiCreateParam,
      uiComponentId: uiComponent.id,
    })
    .returning();
  await db.insert(dbSchema.uiCarouselReviews).values(
    carouselItemParams.map((params) => ({
      ...params,
      uiCarouselId: carousel.id,
    })),
  );
};

export const seedCarouselReview = async (db: TransactionClient) => {
  const carouselParams: IUiCarouselComponentCreate<UiCarouselReview> = {
    ...typia.random<IUiCarouselComponentCreate<UiCarouselReview>>(),
  };
  const carouselItemParams: IUiCarouselReviewCreate[] =
    typia.random<IUiCarouselReviewCreate[]>();

  await createCarouselReview(carouselParams, carouselItemParams, db);
};
