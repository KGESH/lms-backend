import { Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type IEbookProductSnapshotTableOfContent = {
  id: Uuid;
  productSnapshotId: Uuid;
  richTextContent: string;
};

export type IEbookProductSnapshotTableOfContentCreate = Optional<
  IEbookProductSnapshotTableOfContent,
  'id'
>;
