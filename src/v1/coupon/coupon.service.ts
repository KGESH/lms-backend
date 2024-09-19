import { Injectable, Logger } from '@nestjs/common';
import { CouponRepository } from '@src/v1/coupon/coupon.repository';
import {
  ICoupon,
  ICouponCreate,
  ICouponUpdate,
} from '@src/v1/coupon/coupon.interface';
import { Uuid } from '@src/shared/types/primitive';

@Injectable()
export class CouponService {
  private readonly logger = new Logger(CouponService.name);
  constructor(private readonly couponRepository: CouponRepository) {}

  async createCoupon(params: ICouponCreate): Promise<ICoupon> {
    const coupon = await this.couponRepository.createCoupon(params);

    this.logger.log('[CreateCoupon]', coupon);

    return coupon;
  }

  async updateCoupon(
    where: Pick<ICoupon, 'id'>,
    params: ICouponUpdate,
  ): Promise<ICoupon> {
    {
      const updated = await this.couponRepository.updateCoupon(where, params);

      this.logger.log('[UpdateCoupon]', updated);

      return updated;
    }
  }

  async deleteCoupon(where: Pick<ICoupon, 'id'>): Promise<Uuid> {
    const deletedCouponId = await this.couponRepository.deleteCoupon(where);

    this.logger.log('[DeleteCoupon ID]', deletedCouponId);

    return deletedCouponId;
  }
}
