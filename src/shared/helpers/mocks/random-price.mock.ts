import { Price } from '@src/shared/types/primitive';
import * as typia from 'typia';
import {
  IProductSnapshotFixedAmountDiscount,
  IProductSnapshotPercentDiscount,
} from '@src/v1/product/common/snapshot/discount/product-snapshot-discount.interface';

type RandomPrice = number &
  typia.tags.Type<'uint32'> &
  typia.tags.Minimum<300_000> &
  typia.tags.Maximum<1_000_000>;

type RandomDiscountPercent = number &
  typia.tags.Type<'uint32'> &
  typia.tags.Minimum<10> &
  typia.tags.Maximum<50>;

type RandomDiscountAmount = number &
  typia.tags.Type<'uint32'> &
  typia.tags.Minimum<10_000> &
  typia.tags.Maximum<100_000>;

export const generateRandomPrice = (): Price => {
  const randomPrice = typia.random<RandomPrice>();
  return `${Math.floor(randomPrice / 1000) * 1000}`;
};

export const generateRandomFixedAmountDiscount =
  (): IProductSnapshotFixedAmountDiscount => {
    const randomDiscountAmount = typia.random<RandomDiscountAmount>();
    return {
      discountType: 'fixed_amount',
      value: `${Math.floor(randomDiscountAmount / 1000) * 1000}`,
    };
  };

export const generateRandomPercentDiscount =
  (): IProductSnapshotPercentDiscount => {
    return {
      discountType: 'percent',
      value: `${typia.random<RandomDiscountPercent>()}`,
    };
  };

export const generateRandomDiscount = ():
  | IProductSnapshotFixedAmountDiscount
  | IProductSnapshotPercentDiscount => {
  return Math.random() > 0.5
    ? generateRandomFixedAmountDiscount()
    : generateRandomPercentDiscount();
};
