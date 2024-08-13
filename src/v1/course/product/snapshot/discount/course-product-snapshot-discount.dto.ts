import {
  DiscountType,
  FixedAmount,
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
  validFrom: string | null;
  validTo: string | null;
} & (
  | CourseProductSnapshotFixedAmountDiscount
  | CourseProductSnapshotPercentDiscount
);
