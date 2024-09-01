import { Uuid } from '@src/shared/types/primitive';
import { Pagination } from '@src/shared/types/pagination';

export type IPostComment = {
  id: Uuid;
  postId: Uuid;
  userId: Uuid;
  parentId: Uuid | null;
  createdAt: Date;
};

export type IPostCommentCreate = Pick<
  IPostComment,
  'postId' | 'userId' | 'parentId'
>;

export type IPostCommentPagination = {
  parentPagination: Pagination;
  childrenPagination: Omit<Pagination, 'page'>;
};
