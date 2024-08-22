import { Price, Uuid } from '@src/shared/types/primitive';

export type CourseOrderPurchaseDto = {
  courseId: Uuid;
  userId: Uuid;
  paymentMethod: string;
  amount: Price;
};
