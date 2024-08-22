import { Uuid } from '@src/shared/types/primitive';

export type ProductSnapshotRefundPolicyDto = {
  id: Uuid;
  productSnapshotId: Uuid;
  richTextContent: string;
};
