import { Price, Uuid } from '../../shared/types/primitive';
import { Optional } from '../../shared/types/optional';

export type IOrderRefund = {
  id: Uuid;
  orderId: Uuid;
  refundedAmount: Price;
  refundedAt: Date;
};

export type IOrderRefundCreate = Optional<IOrderRefund, 'id'>;
