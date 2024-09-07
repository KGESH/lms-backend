import { Uuid } from '@src/shared/types/primitive';
import { IOrderCreate } from '@src/v1/order/order.interface';

export type IEbookOrderPurchase = Pick<
  IOrderCreate,
  'userId' | 'paymentId' | 'txId' | 'amount' | 'paymentMethod' | 'paidAt'
> & {
  ebookId: Uuid;
};
