import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  ICoupon,
  ICouponCreate,
  ICouponUpdate,
} from '@src/v1/coupon/coupon.interface';
import { dbSchema } from '@src/infra/db/schema';
import { eq } from 'drizzle-orm';
import { Uuid } from '@src/shared/types/primitive';
import { assertCoupon } from '@src/shared/helpers/assert/coupon';

@Injectable()
export class CouponRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createCoupon(
    params: ICouponCreate,
    db = this.drizzle.db,
  ): Promise<ICoupon> {
    const [coupon] = await db
      .insert(dbSchema.coupons)
      .values(params)
      .returning();

    return assertCoupon(coupon);
  }

  async updateCoupon(
    where: Pick<ICoupon, 'id'>,
    params: ICouponUpdate,
    db = this.drizzle.db,
  ): Promise<ICoupon> {
    const [updated] = await db
      .update(dbSchema.coupons)
      .set(params)
      .where(eq(dbSchema.coupons.id, where.id))
      .returning();

    return assertCoupon(updated);
  }

  // Cascade delete
  async deleteCoupon(
    where: Pick<ICoupon, 'id'>,
    db = this.drizzle.db,
  ): Promise<Uuid> {
    await db.delete(dbSchema.coupons).where(eq(dbSchema.coupons.id, where.id));
    return where.id;
  }
}
