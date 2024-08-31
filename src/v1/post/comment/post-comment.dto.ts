import { ISO8601, Uuid } from '@src/shared/types/primitive';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';

export type PostCommentDto = {
  id: Uuid;
  postId: Uuid;
  user: IUserWithoutPassword;
  content: string;
  createdAt: ISO8601;
};
