import {
  DiscountType,
  FixedAmount,
  Percent,
  Percentage,
  Price,
  Uuid,
} from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type IProductSnapshotFixedAmountDiscount = {
  discountType: Extract<DiscountType, FixedAmount>;
  value: Price;
};

export type IProductSnapshotPercentDiscount = {
  discountType: Extract<DiscountType, Percent>;
  value: Percentage;
};

export type IProductSnapshotDiscount = {
  id: Uuid;
  productSnapshotId: Uuid;
  enabled: boolean;
  validFrom: Date | null;
  validTo: Date | null;
} & (IProductSnapshotFixedAmountDiscount | IProductSnapshotPercentDiscount);

export type IProductSnapshotDiscountCreate = Optional<
  IProductSnapshotDiscount,
  'id'
>;
