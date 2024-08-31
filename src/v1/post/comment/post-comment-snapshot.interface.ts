import { Uuid } from '@src/shared/types/primitive';

export type IPostCommentSnapshot = {
  id: Uuid;
  commentId: Uuid;
  content: string;
  createdAt: Date;
};

export type IPostCommentSnapshotCreate = Pick<
  IPostCommentSnapshot,
  'commentId' | 'content'
>;
