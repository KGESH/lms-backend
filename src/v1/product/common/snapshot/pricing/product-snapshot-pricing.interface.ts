import { Price, Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type IProductSnapshotPricing = {
  id: Uuid;
  productSnapshotId: Uuid;
  amount: Price; // Todo: decimal
};

export type IProductSnapshotPricingCreate = Optional<
  IProductSnapshotPricing,
  'id'
>;
