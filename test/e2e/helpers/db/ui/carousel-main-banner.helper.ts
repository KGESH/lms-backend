import { dbSchema } from '../../../../../src/infra/db/schema';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import { IUiCarouselComponentCreate } from '../../../../../src/v1/ui/component/carousel/ui-carousel.interface';
import { UiCarouselMainBanner } from '../../../../../src/v1/ui/category/ui-category.interface';
import { IUiCarouselContentCreate } from '../../../../../src/v1/ui/component/carousel/carousel-content/ui-carousel-content.interface';
import * as typia from 'typia';

export const createCarouselMainBanner = async (
  carouselParams: IUiCarouselComponentCreate<UiCarouselMainBanner>,
  carouselItemParams: IUiCarouselContentCreate[],
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
  await db.insert(dbSchema.uiCarouselContents).values(
    carouselItemParams.map((params) => ({
      ...params,
      uiCarouselId: carousel.id,
    })),
  );
};

const createManyCarouselMainBanner = async (
  createManyParams: {
    carouselParams: IUiCarouselComponentCreate<UiCarouselMainBanner>;
    carouselItemParams: IUiCarouselContentCreate[];
  }[],
  db: TransactionClient,
) => {
  return await Promise.all(
    createManyParams.map(({ carouselParams, carouselItemParams }) =>
      createCarouselMainBanner(carouselParams, carouselItemParams, db),
    ),
  );
};

export const seedCarouselMainBanner = async (
  { count }: { count: number },
  db: TransactionClient,
  path?: string,
) => {
  const randomImageUrls = [
    'https://aceternity.com/images/products/thumbnails/new/cursor.png',
    'https://aceternity.com/images/products/thumbnails/new/rogue.png',
    'https://aceternity.com/images/products/thumbnails/new/moonbeam.png',
    'https://aceternity.com/images/products/thumbnails/new/editorially.png',
    'https://aceternity.com/images/products/thumbnails/new/editrix.png',
    'https://aceternity.com/images/products/thumbnails/new/pixelperfect.png',
    'https://aceternity.com/images/products/thumbnails/new/tailwindmasterkit.png',
  ];

  const createManyParams = Array.from({ length: count }).map(() => ({
    carouselParams: {
      ...typia.random<IUiCarouselComponentCreate<UiCarouselMainBanner>>(),
      path: path ? path : typia.random<string>(),
    } satisfies IUiCarouselComponentCreate<UiCarouselMainBanner>,
    carouselItemParams: Array.from({ length: randomImageUrls.length }).map(
      (_, index) => ({
        ...typia.random<IUiCarouselContentCreate>(),
        type: 'image',
        contentUrl: randomImageUrls[index],
        linkUrl: randomImageUrls[index],
        sequence: index,
      }),
    ) satisfies IUiCarouselContentCreate[],
  }));

  return await createManyCarouselMainBanner(createManyParams, db);
};
