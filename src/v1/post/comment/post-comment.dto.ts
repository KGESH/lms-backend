import { ISO8601, Uuid } from '@src/shared/types/primitive';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';

export type PostCommentDto = {
  id: Uuid;
  postId: Uuid;
  parentId: Uuid | null;
  content: string;
  createdAt: ISO8601;
  deletedAt: ISO8601 | null;
  user: IUserWithoutPassword;
};

export type PostCommentWithChildrenDto = PostCommentDto & {
  children: PostCommentDto[];
};

export type CreatePostCommentDto = Pick<PostCommentDto, 'content' | 'parentId'>;

export type UpdatePostCommentDto = Pick<PostCommentDto, 'content'>;
