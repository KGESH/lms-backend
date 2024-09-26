import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IUiMarketingBannerComponent } from '@src/v1/ui/component/marketing-banner/ui-marketing-banner.interface';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { UI_CATEGORY } from '@src/v1/ui/category/ui-category.interface';

@Injectable()
export class UiMarketingBannerComponentQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findUiMarketingBanner(
    where: Pick<IUiMarketingBannerComponent['ui'], 'uiComponentId'>,
  ): Promise<IUiMarketingBannerComponent | null> {
    const uiMarketingBanner =
      await this.drizzle.db.query.uiMarketingBanners.findFirst({
        where: eq(
          dbSchema.uiMarketingBanners.uiComponentId,
          where.uiComponentId,
        ),
        with: {
          uiComponent: true,
        },
      });

    if (!uiMarketingBanner) {
      return null;
    }

    return {
      ...uiMarketingBanner.uiComponent,
      category: UI_CATEGORY.MARKETING_BANNER,
      ui: {
        ...uiMarketingBanner,
      },
    } satisfies IUiMarketingBannerComponent;
  }

  async findUiMarketingBannerOrThrow(
    where: Pick<IUiMarketingBannerComponent['ui'], 'uiComponentId'>,
  ): Promise<IUiMarketingBannerComponent> {
    const uiMarketingBanner = await this.findUiMarketingBanner(where);

    if (!uiMarketingBanner) {
      throw new NotFoundException('UiMarketingBanner not found');
    }

    return uiMarketingBanner;
  }

  async findManyUiMarketingBanners(): Promise<IUiMarketingBannerComponent[]> {
    const uiMarketingBanners =
      await this.drizzle.db.query.uiMarketingBanners.findMany({
        with: {
          uiComponent: true,
        },
      });

    return uiMarketingBanners.map(({ uiComponent, ...uiMarketingBanner }) => {
      return {
        ...uiComponent,
        category: UI_CATEGORY.MARKETING_BANNER,
        ui: {
          ...uiMarketingBanner,
        },
      } satisfies IUiMarketingBannerComponent;
    });
  }
}
