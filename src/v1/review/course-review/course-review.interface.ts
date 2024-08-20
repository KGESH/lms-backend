import { Uuid } from '../../../shared/types/primitive';
import { IReviewCreate, IReviewSnapshotCreate } from '../review.interface';

export type ICourseReviewCreate = {
  courseId: Uuid;
  reviewCreateParams: IReviewCreate;
  snapshotCreateParams: Omit<IReviewSnapshotCreate, 'reviewId'>;
};
