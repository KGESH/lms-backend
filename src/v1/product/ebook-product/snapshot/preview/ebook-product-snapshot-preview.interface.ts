import { Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type IEbookProductSnapshotPreview = {
  id: Uuid;
  productSnapshotId: Uuid;
  richTextContent: string;
};

export type IEbookProductSnapshotPreviewCreate = Optional<
  IEbookProductSnapshotPreview,
  'id'
>;
