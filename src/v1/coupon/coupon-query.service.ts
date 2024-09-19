import { Injectable, NotFoundException } from '@nestjs/common';
import { CouponQueryRepository } from '@src/v1/coupon/coupon-query.repository';
import { ICoupon, ICouponPagination } from '@src/v1/coupon/coupon.interface';

@Injectable()
export class CouponQueryService {
  constructor(private readonly couponQueryRepository: CouponQueryRepository) {}

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

  async findCoupons(pagination: ICouponPagination): Promise<ICoupon[]> {
    return await this.couponQueryRepository.findManyCoupons(pagination);
  }
}
