import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ICoupon, ICouponPagination } from '@src/v1/coupon/coupon.interface';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import * as typia from 'typia';

@Injectable()
export class CouponQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findCoupon(where: Pick<ICoupon, 'id'>): Promise<ICoupon | null> {
    const coupon = await this.drizzle.db.query.coupons.findFirst({
      where: eq(dbSchema.coupons.id, where.id),
    });

    if (!coupon) {
      return null;
    }

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

  async findManyCoupons(pagination: ICouponPagination): Promise<ICoupon[]> {
    const coupons = await this.drizzle.db.query.coupons.findMany({
      orderBy: (coupon, { asc, desc }) =>
        pagination.orderBy === 'asc'
          ? asc(coupon[pagination.orderByColumn])
          : desc(coupon[pagination.orderByColumn]),
      offset: (pagination.page - 1) * pagination.pageSize,
      limit: pagination.pageSize,
    });

    return coupons.map((coupon) =>
      typia.assert<ICoupon>({
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
      }),
    );
  }
}
