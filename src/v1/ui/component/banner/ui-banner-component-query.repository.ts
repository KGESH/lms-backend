import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IUiBannerComponent } from '@src/v1/ui/component/banner/ui-banner.interface';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { UI_CATEGORY } from '@src/v1/ui/category/ui-category.interface';

@Injectable()
export class UiBannerComponentQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findUiBanner(
    where: Pick<IUiBannerComponent['ui'], 'uiComponentId'>,
  ): Promise<IUiBannerComponent | null> {
    const uiBanner = await this.drizzle.db.query.uiBanners.findFirst({
      where: eq(dbSchema.uiBanners.uiComponentId, where.uiComponentId),
      with: {
        uiComponent: true,
      },
    });

    if (!uiBanner) {
      return null;
    }

    return {
      ...uiBanner.uiComponent,
      category: UI_CATEGORY.BANNER,
      ui: {
        ...uiBanner,
      },
    } satisfies IUiBannerComponent;
  }

  async findUiBannerOrThrow(
    where: Pick<IUiBannerComponent['ui'], 'uiComponentId'>,
  ): Promise<IUiBannerComponent> {
    const uiBanner = await this.findUiBanner(where);

    if (!uiBanner) {
      throw new NotFoundException('UiBanner not found');
    }

    return uiBanner;
  }

  async findManyUiBanners(): Promise<IUiBannerComponent[]> {
    const uiBanners = await this.drizzle.db.query.uiBanners.findMany({
      with: {
        uiComponent: true,
      },
    });

    return uiBanners.map(({ uiComponent, ...uiBanner }) => {
      return {
        ...uiComponent,
        category: UI_CATEGORY.BANNER,
        ui: {
          ...uiBanner,
        },
      } satisfies IUiBannerComponent;
    });
  }
}
