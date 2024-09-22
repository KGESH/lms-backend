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
    const uiCarousel = await this.drizzle.db.query.uiComponents.findFirst({
      where: eq(dbSchema.uiComponents.id, where.uiComponentId),
      with: {
        carousel: true,
      },
    });

    if (!uiCarousel?.carousel) {
      return null;
    }

    const { carousel, ...uiComponent } = uiCarousel;
    return {
      ...uiComponent,
      category: UI_CATEGORY.CAROUSEL,
      ui: {
        ...carousel,
        carouselType: carousel.carouselType as T,
      },
    };
  }
}
