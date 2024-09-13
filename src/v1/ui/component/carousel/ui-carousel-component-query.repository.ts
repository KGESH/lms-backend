import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IUiCarousel,
  IUiCarouselComponent,
} from '@src/v1/ui/component/carousel/ui-carousel.interface';
import {
  UI_CATEGORY,
  UiCarouselType,
} from '@src/v1/ui/category/ui-category.interface';

@Injectable()
export class UiCarouselComponentQueryRepository<T extends UiCarouselType> {
  constructor(private readonly drizzle: DrizzleService) {}

  async findUiCarousel(
    where: Pick<IUiCarousel<T>, 'uiComponentId'>,
  ): Promise<IUiCarouselComponent<T> | null> {
    const uiCarousel = await this.drizzle.db.query.uiCarousels.findFirst({
      with: {
        uiComponent: true,
      },
      where: eq(dbSchema.uiCarousels.uiComponentId, where.uiComponentId),
    });

    if (!uiCarousel) {
      return null;
    }

    return {
      ...uiCarousel.uiComponent,
      category: UI_CATEGORY.CAROUSEL,
      ui: {
        ...uiCarousel,
        carouselType: uiCarousel.carouselType as T,
      },
    };
  }
}
