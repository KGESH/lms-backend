import { Injectable } from '@nestjs/common';
import { IReview, IReviewWithRelations } from '@src/v1/review/review.interface';
import { ReviewQueryRepository } from '@src/v1/review/review-query.repository';
import { Paginated, Pagination } from '@src/shared/types/pagination';
import { Optional, OptionalPick } from '@src/shared/types/optional';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewQueryRepository: ReviewQueryRepository) {}

  async findManyReviews(
    where: Optional<Pick<IReview, 'userId' | 'productType'>, 'userId'>,
    pagination: Pagination,
  ): Promise<Paginated<IReviewWithRelations[]>> {
    return await this.reviewQueryRepository.findManyReviewsWithReplies(
      where,
      pagination,
    );
  }

  async findEveryProductReviews(
    where: OptionalPick<IReview, 'userId'>,
    pagination: Pagination,
  ): Promise<Paginated<IReviewWithRelations[]>> {
    return await this.reviewQueryRepository.findAllProductReviewWithReplies(
      where,
      pagination,
    );
  }
}
