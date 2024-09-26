import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import {
  IUiBannerComponent,
  IUiBannerComponentCreate,
  IUiBannerComponentUpdate,
} from '@src/v1/ui/component/banner/ui-banner.interface';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { UI_CATEGORY } from '@src/v1/ui/category/ui-category.interface';
import { createUuid } from '@src/shared/utils/uuid';
import { UNIQUE_CONSTRAINT_ERROR_CODE } from '@src/infra/db/db.constant';

@Injectable()
export class UiBannerComponentRepository {
  private readonly logger = new Logger(UiBannerComponentRepository.name);
  constructor(private readonly drizzle: DrizzleService) {}

  async createBanner(
    params: IUiBannerComponentCreate,
    db = this.drizzle.db,
  ): Promise<IUiBannerComponent> {
    const id = params.ui.id ?? createUuid();
    const uiComponentId = params.ui.uiComponentId ?? createUuid();
    const { uiComponent, uiBanner } = await db
      .transaction(async (tx) => {
        const [uiComponent] = await tx
          .insert(dbSchema.uiComponents)
          .values({
            id: uiComponentId,
            category: UI_CATEGORY.BANNER,
            name: params.name,
            path: params.path,
            sequence: params.sequence,
            description: params.description,
          })
          .returning();
        const [uiBanner] = await tx
          .insert(dbSchema.uiBanners)
          .values({
            id,
            uiComponentId,
            title: params.ui.title,
            description: params.ui.description,
            linkUrl: params.ui.linkUrl,
          })
          .returning();
        return { uiComponent, uiBanner };
      })
      .catch((e) => {
        this.logger.error(e);
        if (e.code === UNIQUE_CONSTRAINT_ERROR_CODE) {
          throw new ConflictException('UI component name must be unique.');
        }

        throw new InternalServerErrorException('Failed to create UI Banner');
      });

    return {
      ...uiComponent,
      category: UI_CATEGORY.BANNER,
      ui: {
        ...uiBanner,
      },
    } satisfies IUiBannerComponent;
  }

  async updateBanner(
    where: Pick<IUiBannerComponent['ui'], 'id' | 'uiComponentId'>,
    params: IUiBannerComponentUpdate,
    db = this.drizzle.db,
  ): Promise<IUiBannerComponent> {
    const { ui, ...uiComponent } = params;
    const uiComponentId = where.uiComponentId;
    const uiBannerId = where.id;

    await db
      .transaction(async (tx) => {
        if (uiBannerId && ui) {
          await tx
            .update(dbSchema.uiBanners)
            .set(ui)
            .where(eq(dbSchema.uiBanners.id, uiBannerId));
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

        throw new InternalServerErrorException('Failed to update UI Banner');
      });

    const updated = await db.query.uiBanners.findFirst({
      with: {
        uiComponent: true,
      },
      where: eq(dbSchema.uiBanners.id, where.id),
    });

    if (!updated) {
      throw new InternalServerErrorException('Updated UI Banner not found');
    }

    return {
      ...updated.uiComponent,
      category: UI_CATEGORY.BANNER,
      ui: {
        ...updated,
      },
    } satisfies IUiBannerComponent;
  }

  async deleteBanner(
    where: Pick<IUiBannerComponent['ui'], 'id'>,
  ): Promise<IUiBannerComponent> {
    /**
     * Use UI Component cascade delete
     */
    throw new Error(`Assert ${where}`);
  }
}
