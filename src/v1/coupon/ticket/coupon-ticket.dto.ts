import { ISO8601, Uuid } from '@src/shared/types/primitive';
import { CouponDisposableDto } from '@src/v1/coupon/disposable/coupon-disposable.dto';
import { CouponTicketPaymentDto } from '@src/v1/coupon/ticket/payment/coupon-ticket-payment.dto';

/**
 * 발급된 쿠폰
 */
export type CouponTicketDto = {
  /**
   * 발급된 쿠폰 ID
   */
  id: Uuid;

  /**
   * 쿠폰 ID
   */
  couponId: Uuid;

  /**
   * 사용자 ID
   */
  userId: Uuid;

  /**
   * 일회용 쿠폰 코드 ID
   */
  couponDisposableId: Uuid | null;

  /**
   * 발급 일자
   */
  createdAt: ISO8601;

  /**
   * 만료 일자
   */
  expiredAt: ISO8601 | null;
};

export type CreatePublicCouponTicketDto = {
  type: 'public';
} & Pick<CouponTicketDto, 'couponId' | 'userId'>;

export type CreateDisposableCouponTicketDto = {
  type: 'private';
  code: CouponDisposableDto['code'];
} & Pick<CouponTicketDto, 'couponId' | 'userId'>;

export type CreateCouponTicketDto =
  | CreatePublicCouponTicketDto
  | CreateDisposableCouponTicketDto;

export type CouponTicketWithPaymentHistoryDto = CouponTicketDto & {
  payment: CouponTicketPaymentDto | null;
};
