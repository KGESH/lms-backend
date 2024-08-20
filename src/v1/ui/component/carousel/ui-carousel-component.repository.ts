import { Injectable } from '@nestjs/common';
import {
  IUiCarouselComponent,
  IUiCarouselComponentCreate,
  IUiCarouselComponentUpdate,
} from './ui-carousel.interface';
import { DrizzleService } from '../../../../infra/db/drizzle.service';
import { eq } from 'drizzle-orm';
import { dbSchema } from '../../../../infra/db/schema';
import {
  UI_CATEGORY,
  UiCarouselType,
} from '../../category/ui-category.interface';
import { createUuid } from '../../../../shared/utils/uuid';

@Injectable()
// implements IRepository<IUiCarouselComponent<T>>
export class UiCarouselComponentRepository<T extends UiCarouselType> {
  constructor(private readonly drizzle: DrizzleService) {}

  // async findOne(
  //   where: Pick<IUiCarouselComponent<T>['ui'], 'id'>,
  // ): Promise<IUiCarouselComponent<T> | null> {
  //   const uiCarousel = await this.drizzle.db.query.uiCarousels.findFirst({
  //     where: eq(dbSchema.uiCarousels.id, where.id),
  //     with: {
  //       uiComponent: true,
  //     },
  //   });
  //
  //   if (!uiCarousel) {
  //     return null;
  //   }
  //
  //   return {
  //     ...uiCarousel.uiComponent,
  //     category: UI_CATEGORY.CAROUSEL,
  //     ui: {
  //       ...uiCarousel,
  //       carouselType: uiCarousel.carouselType as T,
  //     },
  //   };
  // }

  // async findOneOrThrow(
  //   where: Pick<IUiCarouselComponent<T>['ui'], 'id'>,
  // ): Promise<IUiCarouselComponent<T>> {
  //   const uiCarousel = await this.findOne(where);
  //
  //   if (!uiCarousel) {
  //     throw new NotFoundException('UiCarousel not found');
  //   }
  //
  //   return uiCarousel;
  // }

  // async findMany(pagination: Pagination): Promise<IUiCarouselComponent<T>[]> {
  //   const uiCarousels = await this.drizzle.db.query.uiCarousels.findMany({
  //     with: {
  //       uiComponent: true,
  //     },
  //     where: pagination.page
  //       ? gt(dbSchema.uiCarousels.id, pagination.page)
  //       : undefined,
  //     orderBy:
  //       pagination.orderBy === 'asc'
  //         ? asc(dbSchema.uiCarousels.id)
  //         : desc(dbSchema.uiCarousels.id),
  //     limit: pagination.pageSize,
  //   });
  //
  //   return uiCarousels.map(({ uiComponent, ...uiCarousel }) => ({
  //     ...uiComponent,
  //     category: UI_CATEGORY.CAROUSEL,
  //     ui: {
  //       ...uiCarousel,
  //       carouselType: uiCarousel.carouselType as T,
  //     },
  //   }));
  // }

  async create(
    params: IUiCarouselComponentCreate<T>,
    db = this.drizzle.db,
  ): Promise<IUiCarouselComponent<T>> {
    const id = params.ui.id ?? createUuid();
    const uiComponentId = params.ui.uiComponentId ?? createUuid();

    const { uiComponent, uiCarousel } = await db.transaction(async (tx) => {
      const [uiComponent] = await tx
        .insert(dbSchema.uiComponents)
        .values({
          id: uiComponentId,
          category: UI_CATEGORY.CAROUSEL,
          name: params.name,
          path: params.path,
          sequence: params.sequence,
          description: params.description,
        })
        .returning();
      const [uiCarousel] = await tx
        .insert(dbSchema.uiCarousels)
        .values({
          id,
          uiComponentId,
          carouselType: params.ui?.carouselType,
          title: params.ui?.title,
          description: params.ui?.description,
        })
        .returning();

      return { uiComponent, uiCarousel };
    });

    return {
      ...uiComponent,
      category: UI_CATEGORY.CAROUSEL,
      ui: {
        ...uiCarousel,
        carouselType: uiCarousel.carouselType as T,
      },
    };
  }

  async update(
    where: Pick<IUiCarouselComponent<T>['ui'], 'id' | 'uiComponentId'>,
    params: IUiCarouselComponentUpdate<T>,
    db = this.drizzle.db,
  ): Promise<IUiCarouselComponent<T>> {
    const { ui, ...uiComponent } = params;
    const uiComponentId = where.uiComponentId;
    const uiCarouselId = where.id;

    await db.transaction(async (tx) => {
      if (uiCarouselId && ui) {
        await tx
          .update(dbSchema.uiCarousels)
          .set(ui)
          .where(eq(dbSchema.uiCarousels.id, uiCarouselId));
      }
      if (uiComponentId && uiComponent) {
        await tx
          .update(dbSchema.uiComponents)
          .set(uiComponent)
          .where(eq(dbSchema.uiComponents.id, uiComponentId));
      }
    });

    const updated = await db.query.uiCarousels.findFirst({
      with: {
        uiComponent: true,
      },
      where: eq(dbSchema.uiCarousels.id, where.id),
    });

    if (!updated) {
      throw new Error('Updated UI Carousel not found');
    }

    return {
      ...updated.uiComponent,
      category: UI_CATEGORY.CAROUSEL,
      ui: {
        ...updated,
        carouselType: updated.carouselType as T,
      },
    };
  }

  async delete(
    where: Pick<IUiCarouselComponent<T>['ui'], 'id'>,
  ): Promise<IUiCarouselComponent<T>> {
    /**
     * Use UI Component cascade delete
     */
    throw new Error(`Assert ${where}`);
  }
}
