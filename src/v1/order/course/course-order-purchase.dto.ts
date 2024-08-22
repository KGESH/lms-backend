import { Price, Uuid } from '@src/shared/types/primitive';

export type CourseOrderPurchaseDto = {
  /**
   * 강의 ID.
   */
  courseId: Uuid;
  /**
   * 구매 사용자 ID.
   */
  userId: Uuid;
  /**
   * 결제 수단.
   */
  paymentMethod: string;
  /**
   * 결제 금액.
   */
  amount: Price;
};
