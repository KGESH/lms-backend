import { IPromotion } from '@src/v1/promotion/promotion.interface';
import { IPromotionContent } from '@src/v1/promotion/content/promotion-content.interface';
import { ICoupon } from '@src/v1/coupon/coupon.interface';

export type IPromotionRelations = IPromotion & {
  coupon: ICoupon | null;
  contents: IPromotionContent[];
};
