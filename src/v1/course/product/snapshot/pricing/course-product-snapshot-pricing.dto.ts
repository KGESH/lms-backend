import { Price, Uuid } from '../../../../../shared/types/primitive';

export type CourseProductSnapshotPricingDto = {
  id: Uuid;
  courseProductSnapshotId: Uuid;
  amount: Price;
};
