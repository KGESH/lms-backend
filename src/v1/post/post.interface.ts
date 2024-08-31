import { Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type IPost = {
  id: Uuid;
  userId: Uuid;
  categoryId: Uuid;
  viewCount: number;
  createdAt: Date;
  deletedAt: Date | null;
};

export type IPostCreate = Pick<
  Optional<IPost, 'id' | 'viewCount'>,
  'id' | 'userId' | 'categoryId' | 'viewCount'
>;

export type IPostUpdate = Partial<
  Pick<IPostCreate, 'categoryId' | 'viewCount'>
>;
