import { PostCategoryDto } from '@src/v1/post/category/post-category.dto';
import { PostWithContentDto } from '@src/v1/post/post.dto';
 import { PostCommentWithChildrenDto } from '@src/v1/post/comment/post-comment.dto';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';

export type PostRelationsDto = PostWithContentDto & {
  category: PostCategoryDto;
  author: IUserWithoutPassword;
  likeCount: number;
  commentCount: number;
};

export type PostWithCommentsDto = PostRelationsDto & {
  comments: PostCommentWithChildrenDto[];
};
