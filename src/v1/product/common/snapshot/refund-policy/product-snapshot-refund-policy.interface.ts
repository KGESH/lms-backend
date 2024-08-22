import { Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type IProductSnapshotRefundPolicy = {
  id: Uuid;
  productSnapshotId: Uuid;
  richTextContent: string;
};

export type IProductSnapshotRefundPolicyCreate = Optional<
  IProductSnapshotRefundPolicy,
  'id'
>;
