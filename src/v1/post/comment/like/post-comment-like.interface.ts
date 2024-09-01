import { Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type IPostCommentLike = {
  id: Uuid;
  commentId: Uuid;
  userId: Uuid;
  createdAt: Date;
};

export type IPostCommentLikeCreate = Pick<
  Optional<IPostCommentLike, 'id'>,
  'id' | 'commentId' | 'userId'
>;
