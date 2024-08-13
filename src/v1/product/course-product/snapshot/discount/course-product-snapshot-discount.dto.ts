import {
  DiscountType,
  FixedAmount,
  ISO8601,
  Percent,
  Percentage,
  Price,
} from '../../../../../shared/types/primitive';

export type CourseProductSnapshotFixedAmountDiscount = {
  discountType: Extract<DiscountType, FixedAmount>;
  value: Price;
};

export type CourseProductSnapshotPercentDiscount = {
  discountType: Extract<DiscountType, Percent>;
  value: Percentage;
};

export type CourseProductSnapshotDiscountDto = {
  validFrom: ISO8601 | null;
  validTo: ISO8601 | null;
} & (
  | CourseProductSnapshotFixedAmountDiscount
  | CourseProductSnapshotPercentDiscount
);
