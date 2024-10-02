import { PositiveInt, Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type IProductSnapshot = {
  id: Uuid;
  productId: Uuid;
  thumbnailId: Uuid;
  title: string;
  description: string | null;
  availableDays: PositiveInt | null; // 수강 기간 (일)
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type IProductSnapshotCreate = Pick<
  Optional<IProductSnapshot, 'id'>,
  'id' | 'productId' | 'thumbnailId' | 'title' | 'description' | 'availableDays'
>;
