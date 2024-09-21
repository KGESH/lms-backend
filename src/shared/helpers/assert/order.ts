import * as typia from 'typia';
import { IOrder } from '@src/v1/order/order.interface';
import { dbSchema } from '@src/infra/db/schema';

export const assertOrder = (order: typeof dbSchema.orders.$inferSelect) =>
  typia.assert<IOrder>({
    id: order.id,
    userId: order.userId,
    paymentId: order.paymentId,
    txId: order.txId,
    productType: order.productType,
    title: order.title,
    description: order.description,
    paymentMethod: order.paymentMethod,
    amount: `${order.amount}`,
    paidAt: order.paidAt,
  });
