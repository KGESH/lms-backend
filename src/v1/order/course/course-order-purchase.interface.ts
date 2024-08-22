import { Uuid } from '@src/shared/types/primitive';
import { IOrderCreate } from '@src/v1/order/order.interface';

export type ICourseOrderPurchase = Pick<
  IOrderCreate,
  'userId' | 'amount' | 'paymentMethod' | 'paidAt'
> & {
  courseId: Uuid;
};
