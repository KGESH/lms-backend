import { Price, Uuid } from '../../shared/types/primitive';

export type OrderRefundDto = {
  id: Uuid;
  orderId: Uuid;
  amount: Price;
  refundedAt: Date;
};

export type CreateOrderRefundDto = Pick<OrderRefundDto, 'amount'>;
