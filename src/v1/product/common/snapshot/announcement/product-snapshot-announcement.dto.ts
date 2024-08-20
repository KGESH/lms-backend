import { Uuid } from '../../../../../shared/types/primitive';

export type ProductSnapshotAnnouncementDto = {
  id: Uuid;
  productSnapshotId: Uuid;
  richTextContent: string;
};
