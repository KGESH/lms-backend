import { Injectable, NotFoundException } from '@nestjs/common';
import { CouponQueryRepository } from '@src/v1/coupon/coupon-query.repository';
import { ICoupon, ICouponPagination } from '@src/v1/coupon/coupon.interface';
import { ICouponWithCriteria } from '@src/v1/coupon/criteria/coupon-criteria.interface';
import { Paginated } from '@src/shared/types/pagination';

@Injectable()
export class CouponQueryService {
  constructor(private readonly couponQueryRepository: CouponQueryRepository) {}

  async findCoupons(
    pagination: ICouponPagination,
  ): Promise<Paginated<ICoupon[]>> {
    return await this.couponQueryRepository.findManyCoupons(pagination);
  }

  async findCoupon(where: Pick<ICoupon, 'id'>): Promise<ICoupon | null> {
    return await this.couponQueryRepository.findCoupon(where);
  }

  async findCouponOrThrow(where: Pick<ICoupon, 'id'>): Promise<ICoupon> {
    const coupon = await this.findCoupon(where);

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return coupon;
  }

  async findCouponWithCriteriaOrThrow(
    where: Pick<ICoupon, 'id'>,
  ): Promise<ICouponWithCriteria> {
    const couponWithCriteria =
      await this.couponQueryRepository.findCouponWithCriteria(where);

    if (!couponWithCriteria) {
      throw new NotFoundException('Coupon not found');
    }

    return couponWithCriteria;
  }
}
