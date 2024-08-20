import { Uuid } from '../../../../../shared/types/primitive';

export type ProductSnapshotRefundPolicyDto = {
  id: Uuid;
  productSnapshotId: Uuid;
  richTextContent: string;
};
