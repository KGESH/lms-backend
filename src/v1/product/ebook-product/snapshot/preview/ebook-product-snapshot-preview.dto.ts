import { Uuid } from '@src/shared/types/primitive';

export type EbookProductSnapshotPreviewDto = {
  id: Uuid;
  productSnapshotId: Uuid;
  richTextContent: string;
};

export type CreateEbookProductSnapshotPreviewDto = Pick<
  EbookProductSnapshotPreviewDto,
  'richTextContent'
>;
