import { Price, Uuid } from '../../../shared/types/primitive';

export type CourseOrderPurchaseDto = {
  courseId: Uuid;
  userId: Uuid;
  paymentMethod: string;
  amount: Price;
};
