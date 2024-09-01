import { IPostComment } from '@src/v1/post/comment/post-comment.interface';
import { IPostCommentSnapshot } from '@src/v1/post/comment/post-comment-snapshot.interface';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';

export type IPostCommentRelations = IPostComment & {
  user: IUserWithoutPassword;
  snapshot: IPostCommentSnapshot;
};

export type IPostCommentRelationsWithChildren = IPostCommentRelations & {
  children: IPostCommentRelations[];
};
