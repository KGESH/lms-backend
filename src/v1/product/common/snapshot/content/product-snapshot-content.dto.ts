import { Uuid } from '@src/shared/types/primitive';

export type ProductSnapshotContentDto = {
  id: Uuid;
  productSnapshotId: Uuid;
  richTextContent: string;
};
