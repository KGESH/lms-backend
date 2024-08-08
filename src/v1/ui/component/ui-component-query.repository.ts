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
import { UiCategory } from '../category/ui-category.interface';

@Injectable()
export class UiComponentQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async getUiComponentsByPath(where: Pick<IUiComponentBase, 'path'>): Promise<
    IUiComponentGroup<
      UiCategory,
      IUiRepeatTimerComponent[]
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

    const [repeatTimerEntities] = await Promise.all([repeatTimerUiPromises]);
    const repeatTimerUiComponents: IUiRepeatTimerComponent[] =
      repeatTimerEntities.map((ui) => ({
        ...ui.uiComponent,
        category: 'repeat-timer',
        ui: {
          ...ui,
        },
      }));

    return {
      'repeat-timer': repeatTimerUiComponents,
      banner: [],
      'marketing-banner': [],
      carousel: [],
    };
  }
}
