import { UFloat, Uuid } from '@src/shared/types/primitive';
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
  userId: Uuid;
  comment: string;
  rating: UFloat;
};
