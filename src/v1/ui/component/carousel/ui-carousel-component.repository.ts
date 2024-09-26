import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IUiCarouselComponent,
  IUiCarouselComponentCreate,
  IUiCarouselComponentUpdate,
} from '@src/v1/ui/component/carousel/ui-carousel.interface';
import {
  UI_CATEGORY,
  UiCarouselType,
} from '@src/v1/ui/category/ui-category.interface';
import { createUuid } from '@src/shared/utils/uuid';
import { UNIQUE_CONSTRAINT_ERROR_CODE } from '@src/infra/db/db.constant';

@Injectable()
export class UiCarouselComponentRepository<T extends UiCarouselType> {
  private readonly logger = new Logger(UiCarouselComponentRepository.name);
  constructor(private readonly drizzle: DrizzleService) {}

  async createUiCarouselComponent(
    params: IUiCarouselComponentCreate<T>,
    db = this.drizzle.db,
  ): Promise<IUiCarouselComponent<T>> {
    const id = params.ui.id ?? createUuid();
    const uiComponentId = params.ui.uiComponentId ?? createUuid();

    const { uiComponent, uiCarousel } = await db
      .transaction(async (tx) => {
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
      })
      .catch((e) => {
        this.logger.error(e);
        if (e.code === UNIQUE_CONSTRAINT_ERROR_CODE) {
          throw new ConflictException('UI component name must be unique.');
        }

        throw new InternalServerErrorException('Failed to create UI Carousel');
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

  async updateUiCarouselComponent(
    where: Pick<IUiCarouselComponent<T>['ui'], 'id' | 'uiComponentId'>,
    params: IUiCarouselComponentUpdate<T>,
    db = this.drizzle.db,
  ): Promise<IUiCarouselComponent<T>> {
    const { ui, ...uiComponent } = params;
    const uiComponentId = where.uiComponentId;
    const uiCarouselId = where.id;

    await db
      .transaction(async (tx) => {
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
      })
      .catch((e) => {
        this.logger.error(e);
        if (e.code === UNIQUE_CONSTRAINT_ERROR_CODE) {
          throw new ConflictException('UI component name must be unique.');
        }

        throw new InternalServerErrorException('Failed to update UI Carousel');
      });

    const updated = await db.query.uiCarousels.findFirst({
      with: {
        uiComponent: true,
      },
      where: eq(dbSchema.uiCarousels.id, where.id),
    });

    if (!updated) {
      throw new InternalServerErrorException('Updated UI Carousel not found');
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

  async deleteUiCarouselComponent(
    where: Pick<IUiCarouselComponent<T>['ui'], 'id'>,
  ): Promise<IUiCarouselComponent<T>> {
    /**
     * Use UI Component cascade delete
     */
    throw new Error(`Assert ${where}`);
  }
}
