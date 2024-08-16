import { Uuid } from '../../../../../shared/types/primitive';
import { Optional } from '../../../../../shared/types/optional';

export type IProductSnapshotContent = {
  id: Uuid;
  productSnapshotId: Uuid;
  richTextContent: string;
};

export type IProductSnapshotContentCreate = Optional<
  IProductSnapshotContent,
  'id'
>;
