import * as date from '@src/shared/utils/date';
import {
  IPostWithComments,
  IPostRelationsWithCommentCount,
} from '@src/v1/post/post-relations.interface';
import { PostRelationsDto, PostWithCommentsDto } from '@src/v1/post/post-relations.dto';

export const postToPostWithCommentsDto = (
  post: IPostWithComments,
): PostWithCommentsDto => {
  return {
    ...post,
    title: post.snapshot.title,
    content: post.snapshot.content,
    comments: post.comments.map((comment) => ({
      ...comment,
      content: comment.snapshot.content,
      createdAt: date.toISOString(comment.createdAt),
    })),
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
