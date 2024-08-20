import { CreateReviewDto } from '../review.dto';
import { Uuid } from '../../../shared/types/primitive';

export type CreateCourseReviewDto = CreateReviewDto & {
  courseId: Uuid;
};
