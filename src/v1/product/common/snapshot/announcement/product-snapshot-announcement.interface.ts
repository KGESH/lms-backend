import { Uuid } from '../../../../../shared/types/primitive';
import { Optional } from '../../../../../shared/types/optional';

export type IProductSnapshotAnnouncement = {
  id: Uuid;
  productSnapshotId: Uuid;
  richTextContent: string;
};

export type IProductSnapshotAnnouncementCreate = Optional<
  IProductSnapshotAnnouncement,
  'id'
>;
