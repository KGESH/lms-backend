import { CreateReviewDto } from '@src/v1/review/review.dto';
import { CreateMockReviewUserDto } from '@src/v1/review/mock-review/mock-review-user.dto';
import { Uuid } from '@src/shared/types/primitive';
import { Pagination } from '@src/shared/types/pagination';

export type CreateMockReviewDto = {
  mockUserCreateParams: CreateMockReviewUserDto;
  mockReviewCreateParams: Pick<CreateReviewDto, 'rating' | 'comment'>;
};

export type MockCourseReviewQuery = Partial<Pagination> & {
  courseId?: Uuid;
};

export type MockEbookReviewQuery = Partial<Pagination> & {
  ebookId?: Uuid;
};
