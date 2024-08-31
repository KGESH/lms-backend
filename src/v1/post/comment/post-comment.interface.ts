import { Uuid } from '@src/shared/types/primitive';

export type IPostComment = {
  id: Uuid;
  postId: Uuid;
  userId: Uuid;
  createdAt: Date;
};

export type IPostCommentCreate = Pick<IPostComment, 'postId' | 'userId'>;
