import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  UiCarousel,
  UiCarouselMainBanner,
} from '@src/v1/ui/category/ui-category.interface';
import { IUiCarouselComponent } from '@src/v1/ui/component/carousel/ui-carousel.interface';
import { IUiCarouselMainBannerWithContents } from '@src/v1/ui/component/carousel/carousel-main-banner/ui-carousel-main-banner.interface';

@Injectable()
export class UiCarouselMainBannerQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findCarouselMainBannerWithContents(
    where: Pick<
      IUiCarouselComponent<UiCarouselMainBanner>['ui'],
      'uiComponentId'
    >,
  ): Promise<IUiCarouselMainBannerWithContents | null> {
    const uiComponentWithCarousel =
      await this.drizzle.db.query.uiComponents.findFirst({
        where: eq(dbSchema.uiCarousels.uiComponentId, where.uiComponentId),
        with: {
          carousel: {
            with: {
              contents: true,
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
          carouselType: carousel.carouselType as UiCarouselMainBanner,
        },
      },
      contents: carousel.contents,
    };
  }
}
