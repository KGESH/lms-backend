import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IUiPopupComponent } from '@src/v1/ui/component/popup/ui-popup.interface';
import { count, eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { UI_CATEGORY } from '@src/v1/ui/category/ui-category.interface';
import { Paginated, Pagination } from '@src/shared/types/pagination';

@Injectable()
export class UiPopupComponentQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findManyUiPopups(
    pagination: Pagination,
  ): Promise<Paginated<IUiPopupComponent[]>> {
    const { uiPopups, totalCount } = await this.drizzle.db.transaction(
      async (tx) => {
        const uiPopupsQuery = tx.query.uiPopups.findMany({
          with: {
            uiComponent: true,
          },
          orderBy: (uiPopups, { asc, desc }) =>
            pagination.orderBy === 'asc'
              ? asc(uiPopups.createdAt)
              : desc(uiPopups.createdAt),
          offset: (pagination.page - 1) * pagination.pageSize,
          limit: pagination.pageSize,
        });

        const totalCountQuery = tx
          .select({ totalCount: count() })
          .from(dbSchema.uiPopups);

        const [uiPopups, [{ totalCount }]] = await Promise.all([
          uiPopupsQuery,
          totalCountQuery,
        ]);

        return { uiPopups, totalCount };
      },
    );

    return {
      pagination,
      totalCount: totalCount ?? 0,
      data: uiPopups.map(({ uiComponent, ...uiPopup }) => {
        return {
          ...uiComponent,
          category: UI_CATEGORY.POPUP,
          ui: {
            ...uiPopup,
          },
        } satisfies IUiPopupComponent;
      }),
    };
  }

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
}
