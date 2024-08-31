import { Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type IPostLike = {
  id: Uuid;
  postId: Uuid;
  userId: Uuid;
  createdAt: Date;
};

export type IPostLikeCreate = Pick<
  Optional<IPostLike, 'id'>,
  'id' | 'postId' | 'userId'
>;
