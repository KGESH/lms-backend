import { Uuid } from '@src/shared/types/primitive';

export type PostCommentLikeDto = {
  id: Uuid;
  commentId: Uuid;
  userId: Uuid;
  createdAt: Date;
};

export type CreatePostCommentLikeDto = Pick<PostCommentLikeDto, 'userId'>;
