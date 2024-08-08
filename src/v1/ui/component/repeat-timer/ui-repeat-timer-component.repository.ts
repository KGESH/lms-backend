import { Injectable, NotFoundException } from '@nestjs/common';
import { IRepository } from '../../../../core/base.repository';
import {
  IUiRepeatTimerComponent,
  IUiRepeatTimerComponentCreate,
  IUiRepeatTimerComponentUpdate,
} from './ui-repeat-timer.interface';
import { IPagination } from 'src/shared/types/pagination';
import { DrizzleService } from '../../../../infra/db/drizzle.service';
import { asc, desc, eq } from 'drizzle-orm';
import { dbSchema } from '../../../../infra/db/schema';
import { UI_CATEGORY } from '../../category/ui-category.interface';
import { createUuid } from '../../../../shared/utils/uuid';

@Injectable()
export class UiRepeatTimerComponentRepository
  implements IRepository<IUiRepeatTimerComponent>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async findOne(
    where: Pick<IUiRepeatTimerComponent['ui'], 'id'>,
  ): Promise<IUiRepeatTimerComponent | null> {
    const uiRepeatTimer = await this.drizzle.db.query.uiRepeatTimers.findFirst({
      where: eq(dbSchema.uiRepeatTimers.id, where.id),
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

  async findOneOrThrow(
    where: Pick<IUiRepeatTimerComponent['ui'], 'id'>,
  ): Promise<IUiRepeatTimerComponent> {
    const uiRepeatTimer = await this.findOne(where);

    if (!uiRepeatTimer) {
      throw new NotFoundException('UiRepeatTimer not found');
    }

    return uiRepeatTimer;
  }

  async findMany(pagination: IPagination): Promise<IUiRepeatTimerComponent[]> {
    const uiRepeatTimers = await this.drizzle.db.query.uiRepeatTimers.findMany({
      with: {
        uiComponent: true,
      },
      where: pagination.cursor
        ? eq(dbSchema.uiRepeatTimers.id, pagination.cursor)
        : undefined,
      orderBy:
        pagination.orderBy === 'asc'
          ? asc(dbSchema.uiRepeatTimers.id)
          : desc(dbSchema.uiRepeatTimers.id),
      limit: pagination.pageSize,
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

  async create(
    params: IUiRepeatTimerComponentCreate,
    db = this.drizzle.db,
  ): Promise<IUiRepeatTimerComponent> {
    const id = params.ui.id ?? createUuid();
    const uiComponentId = params.ui.uiComponentId ?? createUuid();
    const { uiComponent, uiRepeatTimer } = await db.transaction(async (tx) => {
      const [uiComponent] = await tx
        .insert(dbSchema.uiComponents)
        .values({
          id: uiComponentId,
          category: 'repeat-timer',
          name: params.name,
          path: params.path,
          sequence: params.sequence,
          description: params.description,
        })
        .returning();
      const [uiRepeatTimer] = await tx
        .insert(dbSchema.uiRepeatTimers)
        .values({
          id,
          uiComponentId,
          title: params.ui.title,
          description: params.ui.description,
          repeatMinutes: params.ui.repeatMinutes,
          buttonLabel: params.ui.buttonLabel,
          buttonHref: params.ui.buttonHref,
        })
        .returning();
      return { uiComponent, uiRepeatTimer };
    });

    return {
      ...uiComponent,
      category: 'repeat-timer',
      ui: {
        ...uiRepeatTimer,
      },
    } satisfies IUiRepeatTimerComponent;
  }

  async update(
    where: Pick<IUiRepeatTimerComponent['ui'], 'id' | 'uiComponentId'>,
    params: IUiRepeatTimerComponentUpdate,
    db = this.drizzle.db,
  ): Promise<IUiRepeatTimerComponent> {
    const { ui, ...uiComponent } = params;

    await db.transaction(async (tx) => {
      const uiComponentId = where.uiComponentId;
      const uiRepeatTimerId = where.id;
      if (uiRepeatTimerId && ui) {
        await tx
          .update(dbSchema.uiRepeatTimers)
          .set(ui)
          .where(eq(dbSchema.uiRepeatTimers.id, uiRepeatTimerId));
      }
      if (uiComponentId && uiComponent) {
        await tx
          .update(dbSchema.uiComponents)
          .set(uiComponent)
          .where(eq(dbSchema.uiComponents.id, uiComponentId));
      }
    });

    const updated = await db.query.uiRepeatTimers.findFirst({
      with: {
        uiComponent: true,
      },
      where: eq(dbSchema.uiRepeatTimers.id, where.id),
    });

    if (!updated) {
      throw new Error('Updated UI RepeatTimer not found');
    }

    return {
      ...updated.uiComponent,
      category: 'repeat-timer',
      ui: {
        ...updated,
      },
    } satisfies IUiRepeatTimerComponent;
  }

  async delete(
    where: Pick<IUiRepeatTimerComponent['ui'], 'id'>,
  ): Promise<IUiRepeatTimerComponent> {
    /**
     * Use UI Component cascade delete
     */
    throw new Error(`Assert ${where}`);
  }
}
