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

const createManyCarouselReview = async (
  createManyParams: {
    carouselParams: IUiCarouselComponentCreate<UiCarouselReview>;
    carouselItemParams: IUiCarouselReviewCreate[];
  }[],
  db: TransactionClient,
) => {
  return await Promise.all(
    createManyParams.map(({ carouselParams, carouselItemParams }) =>
      createCarouselReview(carouselParams, carouselItemParams, db),
    ),
  );
};

export const seedCarouselReview = async (
  { count }: { count: number },
  db: TransactionClient,
  path?: string,
) => {
  const createManyParams = Array.from({ length: count }).map(() => ({
    carouselParams: {
      ...typia.random<IUiCarouselComponentCreate<UiCarouselReview>>(),
      path: path ? path : typia.random<string>(),
    },
    carouselItemParams: Array.from({ length: count }).map(() =>
      typia.random<IUiCarouselReviewCreate>(),
    ),
  }));

  return await createManyCarouselReview(createManyParams, db);
};
