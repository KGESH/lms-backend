import { ISO8601, Price, Uuid } from '../../../shared/types/primitive';

export type CourseOrderDto = {
  id: Uuid;
  userId: Uuid;
  courseProductSnapshotId: Uuid;
  paymentMethod: string;
  amount: Price;
  paidAt: ISO8601 | null;
};
