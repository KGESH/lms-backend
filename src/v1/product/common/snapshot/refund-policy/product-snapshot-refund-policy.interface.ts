import { Uuid } from '../../../../../shared/types/primitive';
import { Optional } from '../../../../../shared/types/optional';

export type IProductSnapshotRefundPolicy = {
  id: Uuid;
  productSnapshotId: Uuid;
  richTextContent: string;
};

export type IProductSnapshotRefundPolicyCreate = Optional<
  IProductSnapshotRefundPolicy,
  'id'
>;
