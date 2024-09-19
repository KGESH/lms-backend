import { Price, Uuid } from '@src/shared/types/primitive';

export type CourseOrderPurchaseDto = {
  /**
   * 강의 ID.
   */
  courseId: Uuid;

  /**
   * 구매 사용자 ID.
   */
  userId: Uuid;

  /**
   * PG사 결제 ID.
   */
  paymentId: string | null;

  /**
   * PG사 결제 트랜잭션 ID.
   */
  txId: string | null;

  /**
   * 결제 수단.
   */
  paymentMethod: string;

  /**
   * PG사 결제 완료 금액.
   */
  amount: Price;

  /**
   * 결제시 사용한 쿠폰 티켓 ID 목록.
   */
  couponTicketId: Uuid | null;
};
