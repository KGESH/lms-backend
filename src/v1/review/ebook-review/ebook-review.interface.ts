import { Uuid } from '@src/shared/types/primitive';
import {
  IReviewCreate,
  IReviewSnapshotCreate,
} from '@src/v1/review/review.interface';

export type IEbookReviewCreate = {
  courseId: Uuid;
  reviewCreateParams: IReviewCreate;
  snapshotCreateParams: Omit<IReviewSnapshotCreate, 'reviewId'>;
};
