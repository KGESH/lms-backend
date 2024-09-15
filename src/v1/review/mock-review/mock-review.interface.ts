import {
  IReview,
  IReviewCreate,
  IReviewSnapshot,
  IReviewSnapshotCreate,
} from '@src/v1/review/review.interface';
import {
  IMockReviewUser,
  IMockReviewUserCreate,
} from '@src/v1/review/mock-review/mock-review-user.interface';

export type IMockReview = {
  review: IReview;
  reviewSnapshot: IReviewSnapshot;
  mockUser: IMockReviewUser;
};

export type IMockReviewCreate = {
  reviewCreateParams: IReviewCreate;
  reviewSnapshotCreateParams: Omit<IReviewSnapshotCreate, 'reviewId'>;
  mockUserCreateParams: Omit<IMockReviewUserCreate, 'reviewId'>;
};
