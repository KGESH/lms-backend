import { Uuid } from '@src/shared/types/primitive';

export type EbookProductSnapshotPreviewDto = {
  id: Uuid;
  productSnapshotId: Uuid;
  fileId: Uuid;
};

export type CreateEbookProductSnapshotPreviewDto = Pick<
  EbookProductSnapshotPreviewDto,
  'fileId'
>;
