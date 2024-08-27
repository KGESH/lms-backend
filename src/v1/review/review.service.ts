import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '@src/v1/review/review.repository';
import { IReview, IReviewWithRelations } from '@src/v1/review/review.interface';
import { ReviewQueryRepository } from '@src/v1/review/review-query.repository';
import { Pagination } from '@src/shared/types/pagination';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly reviewQueryRepository: ReviewQueryRepository,
  ) {}

  async findOneById(
    where: Pick<IReview, 'id'>,
  ): Promise<IReviewWithRelations | null> {
    const review = await this.reviewRepository.findOne(where);

    if (!review) {
      return null;
    }

    return await this.reviewQueryRepository.findOneWithReplies(review);
  }

  async findManyReviews(
    where: Pick<IReview, 'productType'>,
    pagination: Pagination,
  ): Promise<IReviewWithRelations[]> {
    return await this.reviewQueryRepository.findManyWithReplies(
      where,
      pagination,
    );
  }
}
