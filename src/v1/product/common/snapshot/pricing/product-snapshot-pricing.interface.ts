import { Price, Uuid } from '../../../../../shared/types/primitive';
import { Optional } from '../../../../../shared/types/optional';

export type IProductSnapshotPricing = {
  id: Uuid;
  productSnapshotId: Uuid;
  amount: Price; // Todo: decimal
};

export type IProductSnapshotPricingCreate = Optional<
  IProductSnapshotPricing,
  'id'
>;
