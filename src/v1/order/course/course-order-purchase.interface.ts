import { Uuid } from '@src/shared/types/primitive';
import { IOrderCreate } from '@src/v1/order/order.interface';

export type ICourseOrderPurchase = Pick<
  IOrderCreate,
  'userId' | 'paymentId' | 'txId' | 'amount' | 'paymentMethod' | 'paidAt'
> & {
  courseId: Uuid;

  /**
   * 결제시 사용한 쿠폰 티켓 ID.
   */
  couponTicketId: Uuid | null;
};
