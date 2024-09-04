import * as date from '@src/shared/utils/date';
import { IPostCommentRelationsWithChildren } from '@src/v1/post/comment/post-comment-relations.interface';
import { PostCommentWithChildrenDto } from '@src/v1/post/comment/post-comment.dto';

export const postCommentWithChildrenToDto = (
  comment: IPostCommentRelationsWithChildren,
): PostCommentWithChildrenDto => {
  return {
    ...comment,
    content: comment.snapshot.content,
    createdAt: date.toISOString(comment.createdAt),
    deletedAt: comment.deletedAt ? date.toISOString(comment.deletedAt) : null,
    children: comment.children.map((child) => ({
      ...child,
      content: child.snapshot.content,
      createdAt: date.toISOString(child.createdAt),
      deletedAt: child.deletedAt ? date.toISOString(child.deletedAt) : null,
    })),
  };
};
