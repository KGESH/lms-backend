import { Price, Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type IOrderRefund = {
  id: Uuid;
  orderId: Uuid;
  refundedAmount: Price;
  refundedAt: Date;
};

export type IOrderRefundCreate = Optional<IOrderRefund, 'id'>;
