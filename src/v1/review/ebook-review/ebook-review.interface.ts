import { Uuid } from '@src/shared/types/primitive';
import {
  IReviewCreate,
  IReviewSnapshotCreate,
} from '@src/v1/review/review.interface';
import { Optional } from '@src/shared/types/optional';

export type IEbookReview = {
  id: Uuid;
  reviewId: Uuid;
  ebookId: Uuid;
  createdAt: Date;
  deletedAt: Date | null;
};

export type IEbookReviewCreate = Pick<
  Optional<IEbookReview, 'id'>,
  'id' | 'ebookId' | 'reviewId' | 'createdAt'
>;

export type IEbookReviewRelationsCreate = {
  ebookId: Uuid;
  reviewCreateParams: IReviewCreate;
  snapshotCreateParams: Omit<IReviewSnapshotCreate, 'reviewId'>;
};
