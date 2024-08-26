import { CreateReviewDto } from '@src/v1/review/review.dto';
import { Uuid } from '@src/shared/types/primitive';

export type CreateEbookReviewDto = CreateReviewDto & {
  courseId: Uuid;
};
