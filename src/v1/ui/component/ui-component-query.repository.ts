import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IUiComponentBase } from '@src/v1/ui/component/ui-component.interface';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { IUiRepeatTimerComponent } from '@src/v1/ui/component/repeat-timer/ui-repeat-timer.interface';
import { UiCarouselType } from '@src/v1/ui/category/ui-category.interface';
import { IUiCarouselComponent } from '@src/v1/ui/component/carousel/ui-carousel.interface';
import { IUiComponents } from '@src/v1/ui/component/ui-component-group.interface';
import * as typia from 'typia';
import { IUiCarouselMainBannerWithContents } from '@src/v1/ui/component/carousel/carousel-main-banner/ui-carousel-main-banner.interface';
import { IUiCarouselReviewWithItems } from '@src/v1/ui/component/carousel/carousel-review/ui-carousel-review.interface';
import { IUiBannerComponent } from '@src/v1/ui/component/banner/ui-banner.interface';
import { IUiMarketingBannerComponent } from '@src/v1/ui/component/marketing-banner/ui-marketing-banner.interface';
import { IUiPopupComponent } from '@src/v1/ui/component/popup/ui-popup.interface';

@Injectable()
export class UiComponentQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async getUiComponentsByPath(
    where: Pick<IUiComponentBase, 'path'>,
  ): Promise<IUiComponents> {
    const uiComponents = await this.drizzle.db.query.uiComponents.findMany({
      where: eq(dbSchema.uiComponents.path, where.path),
      with: {
        repeatTimers: true,
        banners: true,
        marketingBanners: true,
        popups: true,
        carousel: {
          with: {
            reviews: true,
            contents: true,
          },
        },
      },
    });

    const uiRepeatTimers: IUiRepeatTimerComponent[] = [];
    const uiBanners: IUiBannerComponent[] = [];
    const uiMarketingBanners: IUiMarketingBannerComponent[] = [];
    const uiPopups: IUiPopupComponent[] = [];
    const uiCarouselMainBanners: IUiCarouselMainBannerWithContents[] = [];
    const uiCarouselReviews: IUiCarouselReviewWithItems[] = [];
    const uiCarouselProducts: IUiCarouselComponent<UiCarouselType>[] = [];

    uiComponents.forEach((ui) => {
      const category = ui.category;
      switch (category) {
        case 'banner':
          const bannerUiComponent = typia.assert<IUiBannerComponent>({
            ...ui,
            ui: ui.banners,
          });
          uiBanners.push(bannerUiComponent);
          break;

        case 'marketing_banner':
          const marketingBannerUiComponent =
            typia.assert<IUiMarketingBannerComponent>({
              ...ui,
              ui: ui.marketingBanners,
            });
          uiMarketingBanners.push(marketingBannerUiComponent);
          break;

        case 'repeat_timer':
          const repeatTimerUiComponent = typia.assert<IUiRepeatTimerComponent>({
            ...ui,
            ui: ui.repeatTimers,
          });
          uiRepeatTimers.push(repeatTimerUiComponent);
          break;

        case 'popup':
          const popupUiComponent = typia.assert<IUiPopupComponent>({
            ...ui,
            ui: ui.popups,
          });
          uiPopups.push(popupUiComponent);
          break;

        case 'carousel':
          const carouselType = ui.carousel!.carouselType;
          if (carouselType === 'carousel.main_banner') {
            const mainBannerCarousel =
              typia.assert<IUiCarouselMainBannerWithContents>({
                uiCarousel: {
                  ...ui,
                  ui: ui.carousel,
                },
                contents: ui?.carousel?.contents ?? [],
              });
            uiCarouselMainBanners.push(mainBannerCarousel);
          } else if (carouselType === 'carousel.review') {
            const reviewCarousel = typia.assert<IUiCarouselReviewWithItems>({
              uiCarousel: {
                ...ui,
                ui: ui.carousel,
              },
              uiCarouselReviewItems: ui.carousel?.reviews ?? [],
            });
            uiCarouselReviews.push(reviewCarousel);
          } else {
            // Todo: Impl
          }
          break;

        default:
          break;
      }
    });

    // Todo: Impl
    return {
      banners: uiBanners,
      marketingBanners: uiMarketingBanners,
      repeatTimers: uiRepeatTimers,
      popups: uiPopups,
      carousel: {
        mainBannerCarousels: uiCarouselMainBanners,
        reviewCarousels: uiCarouselReviews,
        productCarousels: [],
      },
    };
  }
}
