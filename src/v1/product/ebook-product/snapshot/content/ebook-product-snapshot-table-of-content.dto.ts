import { Uuid } from '@src/shared/types/primitive';

export type EbookProductSnapshotTableOfContentDto = {
  id: Uuid;
  productSnapshotId: Uuid;
  richTextContent: string;
};

export type CreateEbookProductSnapshotTableOfContentDto = Pick<
  EbookProductSnapshotTableOfContentDto,
  'richTextContent'
>;
