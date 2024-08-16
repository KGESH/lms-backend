import { Uuid } from '../../../shared/types/primitive';
import { IOrderCreate } from '../order.interface';

export type ICourseOrderPurchase = Pick<
  IOrderCreate,
  'userId' | 'amount' | 'paymentMethod' | 'paidAt'
> & {
  courseId: Uuid;
};
