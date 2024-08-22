import { Uuid } from '@src/shared/types/primitive';

export type ProductSnapshotAnnouncementDto = {
  id: Uuid;
  productSnapshotId: Uuid;
  richTextContent: string;
};
