import { Price, Uuid } from '@src/shared/types/primitive';

export type OrderRefundDto = {
  id: Uuid;
  orderId: Uuid;
  amount: Price;
  refundedAt: Date;
};

export type CreateOrderRefundDto = Pick<OrderRefundDto, 'amount'>;
