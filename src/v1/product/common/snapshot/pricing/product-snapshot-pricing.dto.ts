import { Price, Uuid } from '../../../../../shared/types/primitive';

export type ProductSnapshotPricingDto = {
  id: Uuid;
  productSnapshotId: Uuid;
  amount: Price;
};
