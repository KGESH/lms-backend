import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IPromotion,
  IPromotionCreate,
  IPromotionUpdate,
} from '@src/v1/promotion/promotion.interface';
import { dbSchema } from '@src/infra/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class PromotionRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createPromotion(
    params: IPromotionCreate,
    db = this.drizzle.db,
  ): Promise<IPromotion> {
    const [promotion] = await db
      .insert(dbSchema.promotions)
      .values(params)
      .returning();

    return promotion;
  }

  async updatePromotion(
    where: Pick<IPromotion, 'id'>,
    params: IPromotionUpdate,
    db = this.drizzle.db,
  ): Promise<IPromotion> {
    const [updated] = await db
      .update(dbSchema.promotions)
      .set(params)
      .where(eq(dbSchema.promotions.id, where.id))
      .returning();

    return updated;
  }

  // Cascade delete
  async deletePromotion(
    where: Pick<IPromotion, 'id'>,
    db = this.drizzle.db,
  ): Promise<IPromotion['id']> {
    await db
      .delete(dbSchema.promotions)
      .where(eq(dbSchema.promotions.id, where.id));

    return where.id;
  }
}
