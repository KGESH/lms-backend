import { ISO8601, Uuid } from '@src/shared/types/primitive';

/**
 * 결제시 발급되는 쿠폰 티켓 사용 내역
 */
export type CouponTicketPaymentDto = {
  /**
   * 사용한 쿠폰 티켓 ID
   */
  id: Uuid;

  /**
   * 발급된 쿠폰 ID
   */
  couponTicketId: Uuid;

  /**
   * 주문 ID
   */
  orderId: Uuid;

  /**
   * 사용 일자
   */
  createdAt: ISO8601;

  /**
   * 삭제 일자 (결제 취소 또는 실패시 설정될 수 있음)
   */
  deletedAt: ISO8601 | null;
};
