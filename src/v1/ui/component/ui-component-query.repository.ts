import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../../infra/db/drizzle.service';
import {
  IUiComponentBase,
  IUiComponentGroup,
  IUiSectionGroupBase,
} from './ui-component.interface';
import { eq, inArray } from 'drizzle-orm';
import { dbSchema } from '../../../infra/db/schema';
import { IUiRepeatTimerComponent } from './repeat-timer/ui-repeat-timer.interface';
import {
  UI_CATEGORY,
  UiCarouselType,
  UiCategory,
} from '../category/ui-category.interface';
import { IUiCarouselComponent } from './carousel/ui-carousel.interface';

@Injectable()
export class UiComponentQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async getUiComponentsByPath(where: Pick<IUiComponentBase, 'path'>): Promise<
    IUiComponentGroup<
      UiCategory,
      IUiRepeatTimerComponent[] | IUiCarouselComponent<UiCarouselType>[]
      // | IUiComponent<'banner', unknown>
      // | IUiComponent<'marketing-banner', unknown>
      // | IUiComponent<'carousel', unknown>
    >
  > {
    const sections = await this.drizzle.db.query.uiComponents.findMany({
      where: eq(dbSchema.uiComponents.path, where.path),
    });

    // group by category.
    const groupedSections = sections.reduce((acc, section) => {
      if (!acc[section.category]) {
        acc[section.category] = [];
      }
      acc[section.category].push(section);
      return acc;
    }, {} as IUiSectionGroupBase);

    const repeatTimerUiComponentIds = groupedSections['repeat-timer'].map(
      (ui) => ui.id,
    );
    const repeatTimerUiPromises = this.drizzle.db.query.uiRepeatTimers.findMany(
      {
        where: inArray(
          dbSchema.uiRepeatTimers.uiComponentId,
          repeatTimerUiComponentIds,
        ),
        with: {
          uiComponent: true,
        },
      },
    );

    const bannerUiComponentIds = groupedSections['banner'].map((ui) => ui.id);
    // Todo: Impl
    const marketingBannerUiComponentIds = groupedSections[
      'marketing-banner'
    ].map((ui) => ui.id);
    // Todo: Impl
    const carouselUiComponentIds = groupedSections['carousel'].map(
      (ui) => ui.id,
    );
    const carouselUiPromises = this.drizzle.db.query.uiCarousels.findMany({
      where: inArray(
        dbSchema.uiCarousels.uiComponentId,
        carouselUiComponentIds,
      ),
      with: {
        uiComponent: true,
        reviews: true,
        // Todo: add other relations
      },
    });

    const [repeatTimerEntities, carouselEntities] = await Promise.all([
      repeatTimerUiPromises,
      carouselUiPromises,
    ]);
    const repeatTimerUiComponents: IUiRepeatTimerComponent[] =
      repeatTimerEntities.map((ui) => ({
        ...ui.uiComponent,
        category: UI_CATEGORY.REPEAT_TIMER,
        ui: {
          ...ui,
        },
      }));

    const carouselUiComponents: IUiCarouselComponent<UiCarouselType>[] =
      carouselEntities.map((ui) => ({
        ...ui.uiComponent,
        category: UI_CATEGORY.CAROUSEL,
        ui: {
          ...ui,
        },
      }));

    return {
      'repeat-timer': repeatTimerUiComponents,
      banner: [],
      'marketing-banner': [],
      carousel: carouselUiComponents,
    };
  }
}
