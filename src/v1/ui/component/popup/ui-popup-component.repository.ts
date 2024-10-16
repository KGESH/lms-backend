import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import {
  IUiPopupComponent,
  IUiPopupComponentCreate,
  IUiPopupComponentUpdate,
} from '@src/v1/ui/component/popup/ui-popup.interface';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { UI_CATEGORY } from '@src/v1/ui/category/ui-category.interface';
import { createUuid } from '@src/shared/utils/uuid';
import { UNIQUE_CONSTRAINT_ERROR_CODE } from '@src/infra/db/db.constant';

@Injectable()
export class UiPopupComponentRepository {
  private readonly logger = new Logger(UiPopupComponentRepository.name);
  constructor(private readonly drizzle: DrizzleService) {}

  async createPopup(
    params: IUiPopupComponentCreate,
    db = this.drizzle.db,
  ): Promise<IUiPopupComponent> {
    const id = params.ui.id ?? createUuid();
    const uiComponentId = params.ui.uiComponentId ?? createUuid();
    const { uiComponent, uiPopup } = await db
      .transaction(async (tx) => {
        const [uiComponent] = await tx
          .insert(dbSchema.uiComponents)
          .values({
            id: uiComponentId,
            category: UI_CATEGORY.POPUP,
            name: params.name,
            path: params.path,
            sequence: params.sequence,
            description: params.description,
          })
          .returning();
        const [uiPopup] = await tx
          .insert(dbSchema.uiPopups)
          .values({
            id,
            uiComponentId,
            title: params.ui.title,
            richTextContent: params.ui.richTextContent,
            buttonLabel: params.ui.buttonLabel,
            linkUrl: params.ui.linkUrl,
          })
          .returning();
        return { uiComponent, uiPopup };
      })
      .catch((e) => {
        this.logger.error(e);
        if (e.code === UNIQUE_CONSTRAINT_ERROR_CODE) {
          throw new ConflictException('UI component name must be unique.');
        }

        throw new InternalServerErrorException('Failed to create UI Popup');
      });

    return {
      ...uiComponent,
      category: UI_CATEGORY.POPUP,
      ui: {
        ...uiPopup,
      },
    } satisfies IUiPopupComponent;
  }

  async updatePopup(
    where: Pick<IUiPopupComponent['ui'], 'id' | 'uiComponentId'>,
    params: IUiPopupComponentUpdate,
    db = this.drizzle.db,
  ): Promise<IUiPopupComponent> {
    const { ui, ...uiComponent } = params;
    const uiComponentId = where.uiComponentId;
    const uiPopupId = where.id;

    await db
      .transaction(async (tx) => {
        if (uiPopupId && ui) {
          await tx
            .update(dbSchema.uiPopups)
            .set(ui)
            .where(eq(dbSchema.uiPopups.id, uiPopupId));
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

        throw new InternalServerErrorException('Failed to update UI Popup');
      });

    const updated = await db.query.uiPopups.findFirst({
      with: {
        uiComponent: true,
      },
      where: eq(dbSchema.uiPopups.id, where.id),
    });

    if (!updated) {
      throw new Error('Updated UI Popup not found');
    }

    return {
      ...updated.uiComponent,
      category: UI_CATEGORY.POPUP,
      ui: {
        ...updated,
      },
    } satisfies IUiPopupComponent;
  }

  async deletePopup(
    where: Pick<IUiPopupComponent['ui'], 'id'>,
  ): Promise<IUiPopupComponent> {
    /**
     * Use UI Component cascade delete
     */
    throw new Error(`Assert ${where}`);
  }
}
