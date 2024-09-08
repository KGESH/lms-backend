import { Price, Uuid } from '@src/shared/types/primitive';

export type OrderRefundDto = {
  /**
   * 환불 내역 ID.
   */
  id: Uuid;

  /**
   * 주문 내역 ID.
   */
  orderId: Uuid;

  /**
   * 환불 금액.
   */
  amount: Price;

  /**
   * 환불 사유.
   */
  reason: string;

  /**
   * 환불이 성공한 시각.
   */
  refundedAt: Date;
};

export type CreateOrderRefundDto = Pick<OrderRefundDto, 'amount' | 'reason'>;
