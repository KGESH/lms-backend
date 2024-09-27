import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import {
  IPromotionContent,
  IPromotionContentCreate,
  IPromotionContentUpdate,
} from '@src/v1/promotion/content/promotion-content.interface';
import { eq } from 'drizzle-orm';

@Injectable()
export class PromotionContentRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createManyPromotionContent(
    params: IPromotionContentCreate[],
    db = this.drizzle.db,
  ): Promise<IPromotionContent[]> {
    const promotionContents = await db
      .insert(dbSchema.promotionContents)
      .values(params)
      .returning();

    return promotionContents;
  }

  async updatePromotionContent(
    where: Pick<IPromotionContent, 'id'>,
    params: IPromotionContentUpdate,
    db = this.drizzle.db,
  ): Promise<IPromotionContent> {
    const [updated] = await db
      .update(dbSchema.promotionContents)
      .set(params)
      .where(eq(dbSchema.promotionContents.id, where.id))
      .returning();

    return updated;
  }

  // Cascade delete
  async deletePromotionContent(
    where: Pick<IPromotionContent, 'id'>,
    db = this.drizzle.db,
  ): Promise<IPromotionContent['id']> {
    await db
      .delete(dbSchema.promotionContents)
      .where(eq(dbSchema.promotionContents.id, where.id));

    return where.id;
  }
}
