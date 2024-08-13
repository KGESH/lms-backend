import { Price, Uuid } from '../../../../../shared/types/primitive';
import { Optional } from '../../../../../shared/types/optional';

export type ICourseProductSnapshotPricing = {
  id: Uuid;
  courseProductSnapshotId: Uuid;
  amount: Price; // Todo: decimal
};

export type ICourseProductSnapshotPricingCreate = Optional<
  ICourseProductSnapshotPricing,
  'id'
>;
