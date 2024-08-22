import { Price, Uuid } from '@src/shared/types/primitive';

export type ProductSnapshotPricingDto = {
  id: Uuid;
  productSnapshotId: Uuid;
  amount: Price;
};
