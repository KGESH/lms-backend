import { Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type IProductSnapshotContent = {
  id: Uuid;
  productSnapshotId: Uuid;
  richTextContent: string;
};

export type IProductSnapshotContentCreate = Optional<
  IProductSnapshotContent,
  'id'
>;
