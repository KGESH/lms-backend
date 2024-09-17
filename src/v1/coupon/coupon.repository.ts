import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ICoupon, ICouponCreate } from '@src/v1/coupon/coupon.interface';
import { dbSchema } from '@src/infra/db/schema';
import * as typia from 'typia';

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
}
