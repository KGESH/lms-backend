import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ICoupon, ICouponPagination } from '@src/v1/coupon/coupon.interface';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import * as typia from 'typia';
import {
  ICouponAllCriteria,
  ICouponCategoryCriteria,
  ICouponCourseCriteria,
  ICouponEbookCriteria,
  ICouponTeacherCriteria,
  ICouponWithCriteria,
} from '@src/v1/coupon/criteria/coupon-criteria.interface';

@Injectable()
export class CouponQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}
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

  async findCouponWithCriteria(
    where: Pick<ICoupon, 'id'>,
  ): Promise<ICouponWithCriteria | null> {
    const coupon = await this.drizzle.db.query.coupons.findFirst({
      where: eq(dbSchema.coupons.id, where.id),
      with: {
        couponAllCriteria: true,
        couponCategoryCriteria: true,
        couponTeacherCriteria: true,
        couponCourseCriteria: true,
        couponEbookCriteria: true,
      },
    });

    if (!coupon) {
      return null;
    }

    return {
      ...typia.assert<ICoupon>({
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
      couponAllCriteria: typia.assert<ICouponAllCriteria[]>(
        coupon.couponAllCriteria,
      ),
      couponCategoryCriteria: typia.assert<ICouponCategoryCriteria[]>(
        coupon.couponCategoryCriteria,
      ),
      couponTeacherCriteria: typia.assert<ICouponTeacherCriteria[]>(
        coupon.couponTeacherCriteria,
      ),
      couponCourseCriteria: typia.assert<ICouponCourseCriteria[]>(
        coupon.couponCourseCriteria,
      ),
      couponEbookCriteria: typia.assert<ICouponEbookCriteria[]>(
        coupon.couponEbookCriteria,
      ),
    };
  }
}
