import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import {
  IUiRepeatTimerComponent,
  IUiRepeatTimerComponentCreate,
  IUiRepeatTimerComponentUpdate,
} from '@src/v1/ui/component/repeat-timer/ui-repeat-timer.interface';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { UI_CATEGORY } from '@src/v1/ui/category/ui-category.interface';
import { createUuid } from '@src/shared/utils/uuid';
import { UNIQUE_CONSTRAINT_ERROR_CODE } from '@src/infra/db/db.constant';

@Injectable()
export class UiRepeatTimerComponentRepository {
  private readonly logger = new Logger(UiRepeatTimerComponentRepository.name);
  constructor(private readonly drizzle: DrizzleService) {}

  async createRepeatTimer(
    params: IUiRepeatTimerComponentCreate,
    db = this.drizzle.db,
  ): Promise<IUiRepeatTimerComponent> {
    const id = params.ui.id ?? createUuid();
    const uiComponentId = params.ui.uiComponentId ?? createUuid();
    const { uiComponent, uiRepeatTimer } = await db
      .transaction(async (tx) => {
        const [uiComponent] = await tx
          .insert(dbSchema.uiComponents)
          .values({
            id: uiComponentId,
            category: UI_CATEGORY.REPEAT_TIMER,
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
      })
      .catch((e) => {
        this.logger.error(e);
        if (e.code === UNIQUE_CONSTRAINT_ERROR_CODE) {
          throw new ConflictException('UI component name must be unique.');
        }

        throw new InternalServerErrorException(
          'Failed to create UI RepeatTimer',
        );
      });

    return {
      ...uiComponent,
      category: UI_CATEGORY.REPEAT_TIMER,
      ui: {
        ...uiRepeatTimer,
      },
    } satisfies IUiRepeatTimerComponent;
  }

  async updateRepeatTimer(
    where: Pick<IUiRepeatTimerComponent['ui'], 'id' | 'uiComponentId'>,
    params: IUiRepeatTimerComponentUpdate,
    db = this.drizzle.db,
  ): Promise<IUiRepeatTimerComponent> {
    const { ui, ...uiComponent } = params;
    const uiComponentId = where.uiComponentId;
    const uiRepeatTimerId = where.id;

    await db
      .transaction(async (tx) => {
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
      })
      .catch((e) => {
        this.logger.error(e);
        if (e.code === UNIQUE_CONSTRAINT_ERROR_CODE) {
          throw new ConflictException('UI component name must be unique.');
        }

        throw new InternalServerErrorException(
          'Failed to update UI RepeatTimer',
        );
      });

    const updated = await db.query.uiRepeatTimers.findFirst({
      with: {
        uiComponent: true,
      },
      where: eq(dbSchema.uiRepeatTimers.id, where.id),
    });

    if (!updated) {
      throw new InternalServerErrorException(
        'Updated UI RepeatTimer not found',
      );
    }

    return {
      ...updated.uiComponent,
      category: UI_CATEGORY.REPEAT_TIMER,
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
