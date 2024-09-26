import { Uuid } from '@src/shared/types/primitive';
import { ICouponTicket } from '@src/v1/coupon/ticket/coupon-ticket.interface';

/**
 * 일회용 쿠폰 코드
 */
export type ICouponDisposable = {
  /**
   * 발급된 일회용 쿠폰 ID
   */
  id: Uuid;

  /**
   * 쿠폰 ID
   */
  couponId: Uuid;

  /**
   * Unique한 일회용 쿠폰 코드
   */
  code: string;

  /**
   * 발급 일자
   */
  createdAt: Date;

  /**
   * 만료 일자
   */
  expiredAt: Date | null;
};

export type ICouponDisposableCreate = Pick<
  ICouponDisposable,
  'couponId' | 'code' | 'expiredAt'
>;

export type ICouponDisposableWithUsedTicket = ICouponDisposable & {
  issuedTicket: ICouponTicket | null;
};
