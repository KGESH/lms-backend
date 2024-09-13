import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IUiRepeatTimerComponent } from '@src/v1/ui/component/repeat-timer/ui-repeat-timer.interface';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { UI_CATEGORY } from '@src/v1/ui/category/ui-category.interface';

@Injectable()
export class UiRepeatTimerComponentQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findUiRepeatTimer(
    where: Pick<IUiRepeatTimerComponent['ui'], 'uiComponentId'>,
  ): Promise<IUiRepeatTimerComponent | null> {
    const uiRepeatTimer = await this.drizzle.db.query.uiRepeatTimers.findFirst({
      where: eq(dbSchema.uiRepeatTimers.uiComponentId, where.uiComponentId),
      with: {
        uiComponent: true,
      },
    });

    if (!uiRepeatTimer) {
      return null;
    }

    return {
      ...uiRepeatTimer.uiComponent,
      category: UI_CATEGORY.REPEAT_TIMER,
      ui: {
        ...uiRepeatTimer,
      },
    } satisfies IUiRepeatTimerComponent;
  }

  async findUiRepeatTimerOrThrow(
    where: Pick<IUiRepeatTimerComponent['ui'], 'uiComponentId'>,
  ): Promise<IUiRepeatTimerComponent> {
    const uiRepeatTimer = await this.findUiRepeatTimer(where);

    if (!uiRepeatTimer) {
      throw new NotFoundException('UiRepeatTimer not found');
    }

    return uiRepeatTimer;
  }

  async findManyUiRepeatTimers(): Promise<IUiRepeatTimerComponent[]> {
    const uiRepeatTimers = await this.drizzle.db.query.uiRepeatTimers.findMany({
      with: {
        uiComponent: true,
      },
    });

    return uiRepeatTimers.map(({ uiComponent, ...uiRepeatTimer }) => {
      return {
        ...uiComponent,
        category: UI_CATEGORY.REPEAT_TIMER,
        ui: {
          ...uiRepeatTimer,
        },
      } satisfies IUiRepeatTimerComponent;
    });
  }
}
