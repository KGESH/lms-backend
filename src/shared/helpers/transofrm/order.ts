import { IOrderRefund } from '@src/v1/order/order-refund.interface';
import { OrderRefundDto } from '@src/v1/order/order-refund.dto';

export const orderRefundToDto = (orderRefund: IOrderRefund): OrderRefundDto => {
  return {
    id: orderRefund.id,
    orderId: orderRefund.orderId,
    amount: orderRefund.refundedAmount,
    refundedAt: orderRefund.refundedAt,
  };
};
