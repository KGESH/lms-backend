import { Uuid } from '../../../shared/types/primitive';
import { ICourseOrder } from './course-order.interface';

export type ICourseOrderPurchase = Pick<
  ICourseOrder,
  'userId' | 'amount' | 'paymentMethod' | 'paidAt'
> & {
  courseId: Uuid;
};
