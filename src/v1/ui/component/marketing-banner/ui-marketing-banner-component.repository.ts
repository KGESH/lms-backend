import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import {
  IUiMarketingBannerComponent,
  IUiMarketingBannerComponentCreate,
  IUiMarketingBannerComponentUpdate,
} from '@src/v1/ui/component/marketing-banner/ui-marketing-banner.interface';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { UI_CATEGORY } from '@src/v1/ui/category/ui-category.interface';
import { createUuid } from '@src/shared/utils/uuid';
import { UNIQUE_CONSTRAINT_ERROR_CODE } from '@src/infra/db/db.constant';

@Injectable()
export class UiMarketingBannerComponentRepository {
  private readonly logger = new Logger(
    UiMarketingBannerComponentRepository.name,
  );
  constructor(private readonly drizzle: DrizzleService) {}

  async createMarketingBanner(
    params: IUiMarketingBannerComponentCreate,
    db = this.drizzle.db,
  ): Promise<IUiMarketingBannerComponent> {
    const id = params.ui.id ?? createUuid();
    const uiComponentId = params.ui.uiComponentId ?? createUuid();
    const { uiComponent, uiMarketingBanner } = await db
      .transaction(async (tx) => {
        const [uiComponent] = await tx
          .insert(dbSchema.uiComponents)
          .values({
            id: uiComponentId,
            category: UI_CATEGORY.MARKETING_BANNER,
            name: params.name,
            path: params.path,
            sequence: params.sequence,
            description: params.description,
          })
          .returning();
        const [uiMarketingBanner] = await tx
          .insert(dbSchema.uiMarketingBanners)
          .values({
            id,
            uiComponentId,
            title: params.ui.title,
            description: params.ui.description,
            linkUrl: params.ui.linkUrl,
          })
          .returning();
        return { uiComponent, uiMarketingBanner };
      })
      .catch((e) => {
        this.logger.error(e);
        if (e.code === UNIQUE_CONSTRAINT_ERROR_CODE) {
          throw new ConflictException('UI component name must be unique.');
        }

        throw new InternalServerErrorException(
          'Failed to create UI MarketingBanner',
        );
      });

    return {
      ...uiComponent,
      category: UI_CATEGORY.MARKETING_BANNER,
      ui: {
        ...uiMarketingBanner,
      },
    } satisfies IUiMarketingBannerComponent;
  }

  async updateMarketingBanner(
    where: Pick<IUiMarketingBannerComponent['ui'], 'id' | 'uiComponentId'>,
    params: IUiMarketingBannerComponentUpdate,
    db = this.drizzle.db,
  ): Promise<IUiMarketingBannerComponent> {
    const { ui, ...uiComponent } = params;
    const uiComponentId = where.uiComponentId;
    const uiMarketingBannerId = where.id;

    await db
      .transaction(async (tx) => {
        if (uiMarketingBannerId && ui) {
          await tx
            .update(dbSchema.uiMarketingBanners)
            .set(ui)
            .where(eq(dbSchema.uiMarketingBanners.id, uiMarketingBannerId));
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
          'Failed to update UI MarketingBanner',
        );
      });

    const updated = await db.query.uiMarketingBanners.findFirst({
      with: {
        uiComponent: true,
      },
      where: eq(dbSchema.uiMarketingBanners.id, where.id),
    });

    if (!updated) {
      throw new Error('Updated UI MarketingBanner not found');
    }

    return {
      ...updated.uiComponent,
      category: UI_CATEGORY.MARKETING_BANNER,
      ui: {
        ...updated,
      },
    } satisfies IUiMarketingBannerComponent;
  }

  async deleteMarketingBanner(
    where: Pick<IUiMarketingBannerComponent['ui'], 'id'>,
  ): Promise<IUiMarketingBannerComponent> {
    /**
     * Use UI Component cascade delete
     */
    throw new Error(`Assert ${where}`);
  }
}
