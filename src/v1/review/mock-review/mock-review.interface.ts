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
import { Uuid } from '@src/shared/types/primitive';
import { OptionalPick } from '@src/shared/types/optional';

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

export type IMockReviewUpdate = {
  reviewId: Uuid;
  reviewSnapshotUpdateParams?: OptionalPick<
    IReviewSnapshotCreate,
    'comment' | 'rating'
  >;
  mockUserCreateParams?: Partial<Omit<IMockReviewUserCreate, 'reviewId'>>;
};
