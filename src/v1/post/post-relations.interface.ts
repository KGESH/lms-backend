import { IPost } from '@src/v1/post/post.interface';
import { IPostSnapshot } from '@src/v1/post/post-snapshot.interface';
import { IPostCategory } from '@src/v1/post/category/post-category.interface';
import { RequiredField } from '@src/shared/types/required-field';
import { IPostCommentRelations } from '@src/v1/post/comment/post-comment-relations.interface';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';

export type IPostWithSnapshot = IPost & {
  snapshot: IPostSnapshot;
};

export type IPostRelations = IPostWithSnapshot & {
  author: IUserWithoutPassword;
  category: IPostCategory;
  likeCount: number;
};

export type IPostRelationsWithCommentCount = IPostRelations & {
  commentCount: number;
};

export type IPostWithComments = IPostRelations & {
  comments: IPostCommentRelations[];
};

export type IPostContentUpdate = RequiredField<
  Partial<
    Pick<IPost, 'categoryId'> &
      Pick<IPostSnapshot, 'postId' | 'title' | 'content'>
  >,
  'postId'
>;
