import { Uuid } from '@src/shared/types/primitive';
import {
  IReviewCreate,
  IReviewSnapshotCreate,
} from '@src/v1/review/review.interface';
import { Optional } from '@src/shared/types/optional';

export type ICourseReview = {
  id: Uuid;
  reviewId: Uuid;
  courseId: Uuid;
  createdAt: Date;
  deletedAt: Date | null;
};

export type ICourseReviewCreate = Pick<
  Optional<ICourseReview, 'id'>,
  'id' | 'courseId' | 'reviewId' | 'createdAt'
>;

export type ICourseReviewRelationsCreate = {
  courseId: Uuid;
  reviewCreateParams: IReviewCreate;
  snapshotCreateParams: Omit<IReviewSnapshotCreate, 'reviewId'>;
};
