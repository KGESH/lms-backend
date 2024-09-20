import * as typia from 'typia';
import { ICoupon } from '@src/v1/coupon/coupon.interface';

export const assertCoupon = (coupon: ICoupon): ICoupon =>
  typia.assert<ICoupon>({
    id: coupon.id,
    name: coupon.name,
    description: coupon.description,
    discountType: coupon.discountType,
    value: `${coupon.value}`,
    limit: coupon.limit ? `${coupon.limit}` : null,
    threshold: coupon.threshold ? `${coupon.threshold}` : null,
    volume: coupon.volume,
    volumePerCitizen: coupon.volumePerCitizen,
    expiredAt: coupon.expiredAt,
    expiredIn: coupon.expiredIn,
    openedAt: coupon.openedAt,
    closedAt: coupon.closedAt,
  });
