import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IUiPopupComponent } from '@src/v1/ui/component/popup/ui-popup.interface';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { UI_CATEGORY } from '@src/v1/ui/category/ui-category.interface';

@Injectable()
export class UiPopupComponentQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findUiPopup(
    where: Pick<IUiPopupComponent['ui'], 'uiComponentId'>,
  ): Promise<IUiPopupComponent | null> {
    const uiPopup = await this.drizzle.db.query.uiPopups.findFirst({
      where: eq(dbSchema.uiPopups.uiComponentId, where.uiComponentId),
      with: {
        uiComponent: true,
      },
    });

    if (!uiPopup) {
      return null;
    }

    return {
      ...uiPopup.uiComponent,
      category: UI_CATEGORY.POPUP,
      ui: {
        ...uiPopup,
      },
    } satisfies IUiPopupComponent;
  }

  async findUiPopupOrThrow(
    where: Pick<IUiPopupComponent['ui'], 'uiComponentId'>,
  ): Promise<IUiPopupComponent> {
    const uiPopup = await this.findUiPopup(where);

    if (!uiPopup) {
      throw new NotFoundException('UiPopup not found');
    }

    return uiPopup;
  }

  async findManyUiPopups(): Promise<IUiPopupComponent[]> {
    const uiPopups = await this.drizzle.db.query.uiPopups.findMany({
      with: {
        uiComponent: true,
      },
    });

    return uiPopups.map(({ uiComponent, ...uiPopup }) => {
      return {
        ...uiComponent,
        category: UI_CATEGORY.POPUP,
        ui: {
          ...uiPopup,
        },
      } satisfies IUiPopupComponent;
    });
  }
}
