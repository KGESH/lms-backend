import {
  IPostWithComments,
  IPostRelationsWithCommentCount,
} from '@src/v1/post/post-relations.interface';
import {
  PostRelationsDto,
  PostWithCommentsDto,
} from '@src/v1/post/post-relations.dto';
import { postCommentWithChildrenToDto } from '@src/shared/helpers/transofrm/post-comment';

export const postToPostWithCommentsDto = (
  post: IPostWithComments,
): PostWithCommentsDto => {
  return {
    ...post,
    title: post.snapshot.title,
    content: post.snapshot.content,
    comments: post.comments.map(postCommentWithChildrenToDto),
  };
};

export const postToPostWithCommentCountDto = (
  post: IPostRelationsWithCommentCount,
): PostRelationsDto => {
  return {
    ...post,
    title: post.snapshot.title,
    content: post.snapshot.content,
    commentCount: post.commentCount,
  };
};
