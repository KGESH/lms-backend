import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  ICoupon,
  ICouponCreate,
  ICouponUpdate,
} from '@src/v1/coupon/coupon.interface';
import { dbSchema } from '@src/infra/db/schema';
import * as typia from 'typia';
import { eq } from 'drizzle-orm';
import { Uuid } from '@src/shared/types/primitive';

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

    return typia.assert<ICoupon>({
      id: coupon.id,
      name: coupon.name,
      description: coupon.description,
      closedAt: coupon.closedAt,
      discountType: coupon.discountType,
      expiredAt: coupon.expiredAt,
      expiredIn: coupon.expiredIn,
      limit: coupon.limit,
      openedAt: coupon.openedAt,
      threshold: coupon.threshold,
      value: coupon.value,
      volume: coupon.volume,
      volumePerCitizen: coupon.volumePerCitizen,
    });
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

    return typia.assert<ICoupon>({
      id: updated.id,
      name: updated.name,
      description: updated.description,
      closedAt: updated.closedAt,
      discountType: updated.discountType,
      expiredAt: updated.expiredAt,
      expiredIn: updated.expiredIn,
      limit: updated.limit,
      openedAt: updated.openedAt,
      threshold: updated.threshold,
      value: updated.value,
      volume: updated.volume,
      volumePerCitizen: updated.volumePerCitizen,
    });
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
