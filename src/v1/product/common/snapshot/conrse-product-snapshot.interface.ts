import { Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

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
