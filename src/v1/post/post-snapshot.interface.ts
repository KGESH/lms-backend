import { Uuid } from '@src/shared/types/primitive';

export type IPostSnapshot = {
  id: Uuid;
  postId: Uuid;
  title: string;
  content: string;
  createdAt: Date;
};

export type IPostSnapshotCreate = Pick<
  IPostSnapshot,
  'postId' | 'title' | 'content'
>;
