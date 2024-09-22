import { Injectable } from '@nestjs/common';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IUiCarouselContent,
  IUiCarouselContentCreate,
  IUiCarouselContentUpdate,
} from '@src/v1/ui/component/carousel/carousel-content/ui-carousel-content.interface';
import { eq, inArray } from 'drizzle-orm';

@Injectable()
export class UiCarouselContentRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createManyUiCarouselContents(
    params: IUiCarouselContentCreate[],
    db = this.drizzle.db,
  ): Promise<IUiCarouselContent[]> {
    const carouselContents = await db
      .insert(dbSchema.uiCarouselContents)
      .values(params)
      .returning();

    return carouselContents;
  }

  async updateUiCarouselContent(
    where: Pick<IUiCarouselContent, 'id'>,
    params: Omit<IUiCarouselContentUpdate, 'id'>,
    db = this.drizzle.db,
  ): Promise<IUiCarouselContent> {
    const [updated] = await db
      .update(dbSchema.uiCarouselContents)
      .set(params)
      .where(eq(dbSchema.uiCarouselContents.id, where.id))
      .returning();

    return updated;
  }

  async deleteManyUiCarouselContents(
    ids: IUiCarouselContent['id'][],
    db = this.drizzle.db,
  ): Promise<IUiCarouselContent['id'][]> {
    await db
      .delete(dbSchema.uiCarouselContents)
      .where(inArray(dbSchema.uiCarouselContents.id, ids));

    return ids;
  }
}
