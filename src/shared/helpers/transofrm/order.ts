import { IOrderRefund } from '../../../v1/order/order-refund.interface';
import { OrderRefundDto } from '../../../v1/order/order-refund.dto';

export const orderRefundToDto = (orderRefund: IOrderRefund): OrderRefundDto => {
  return {
    id: orderRefund.id,
    orderId: orderRefund.orderId,
    amount: orderRefund.refundedAmount,
    refundedAt: orderRefund.refundedAt,
  };
};
