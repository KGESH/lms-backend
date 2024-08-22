import {
  DiscountType,
  FixedAmount,
  ISO8601,
  Percent,
  Percentage,
  Price,
  Uuid,
} from '@src/shared/types/primitive';

export type ProductSnapshotFixedAmountDiscount = {
  discountType: Extract<DiscountType, FixedAmount>;
  value: Price;
};

export type ProductSnapshotPercentDiscount = {
  discountType: Extract<DiscountType, Percent>;
  value: Percentage;
};

export type ProductSnapshotDiscountDto = {
  id: Uuid;
  productSnapshotId: Uuid;
  validFrom: ISO8601 | null;
  validTo: ISO8601 | null;
} & (ProductSnapshotFixedAmountDiscount | ProductSnapshotPercentDiscount);
