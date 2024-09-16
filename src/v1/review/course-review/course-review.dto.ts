import { CreateReviewDto } from '@src/v1/review/review.dto';
import { Uuid } from '@src/shared/types/primitive';

export type CreateCourseReviewDto = Pick<CreateReviewDto, 'rating' | 'comment'>;

export type UpdateCourseReviewDto = Partial<CreateCourseReviewDto> & {
  reviewId: Uuid;
};
