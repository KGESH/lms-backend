import { Uuid } from '../../../../../shared/types/primitive';

export type ProductSnapshotContentDto = {
  id: Uuid;
  productSnapshotId: Uuid;
  richTextContent: string;
};
