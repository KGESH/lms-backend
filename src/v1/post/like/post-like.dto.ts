import { Uuid } from '@src/shared/types/primitive';

export type PostLikeDto = {
  id: Uuid;
  postId: Uuid;
  userId: Uuid;
  createdAt: Date;
};

export type CreatePostLikeDto = Pick<PostLikeDto, 'userId'>;
