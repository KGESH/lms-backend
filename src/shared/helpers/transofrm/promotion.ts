import { IPromotion } from '@src/v1/promotion/promotion.interface';
import {
  PromotionDto,
  PromotionPageDto,
} from '@src/v1/promotion/promotion.dto';
import * as date from '@src/shared/utils/date';
import { IPromotionRelations } from '@src/v1/promotion/promotion-relations.interface';
import { couponToDto } from '@src/shared/helpers/transofrm/coupon';

export const promotionToDto = (promotion: IPromotion): PromotionDto => ({
  ...promotion,
  openedAt: date.toIsoStringOrNull(promotion.openedAt),
  closedAt: date.toIsoStringOrNull(promotion.closedAt),
  createdAt: date.toISOString(promotion.createdAt),
  deletedAt: date.toIsoStringOrNull(promotion.deletedAt),
});

export const promotionPageToDto = (
  promotionRelations: IPromotionRelations,
): PromotionPageDto => ({
  ...promotionToDto(promotionRelations),
  contents: promotionRelations.contents,
  coupon: promotionRelations.coupon
    ? couponToDto(promotionRelations.coupon)
    : null,
});
