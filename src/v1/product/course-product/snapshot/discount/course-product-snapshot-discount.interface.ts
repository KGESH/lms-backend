import {
  DiscountType,
  FixedAmount,
  ISO8601,
  Percent,
  Percentage,
  Price,
  Uuid,
} from '../../../../../shared/types/primitive';
import { Optional } from '../../../../../shared/types/optional';

export type ICourseProductSnapshotFixedAmountDiscount = {
  discountType: Extract<DiscountType, FixedAmount>;
  value: Price;
};

export type ICourseProductSnapshotPercentDiscount = {
  discountType: Extract<DiscountType, Percent>;
  value: Percentage;
};

export type ICourseProductSnapshotDiscount = {
  id: Uuid;
  courseProductSnapshotId: Uuid;
  validFrom: Date | null;
  validTo: Date | null;
} & (
  | ICourseProductSnapshotFixedAmountDiscount
  | ICourseProductSnapshotPercentDiscount
);

export type ICourseProductSnapshotDiscountCreate = Optional<
  ICourseProductSnapshotDiscount,
  'id'
>;
