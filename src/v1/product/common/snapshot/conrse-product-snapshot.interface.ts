import { Uuid } from '../../../../shared/types/primitive';
import { Optional } from '../../../../shared/types/optional';

export type IProductSnapshot = {
  id: Uuid;
  productId: Uuid;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type IProductSnapshotCreate = Pick<
  Optional<IProductSnapshot, 'id'>,
  'id' | 'productId' | 'title' | 'description'
>;
