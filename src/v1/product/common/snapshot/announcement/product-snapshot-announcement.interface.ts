import { Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type IProductSnapshotAnnouncement = {
  id: Uuid;
  productSnapshotId: Uuid;
  richTextContent: string;
};

export type IProductSnapshotAnnouncementCreate = Optional<
  IProductSnapshotAnnouncement,
  'id'
>;
