import { Injectable } from '@nestjs/common';
import { OrderQueryRepository } from '@src/v1/order/order-query.repository';
import { UserService } from '@src/v1/user/user.service';
import { ReviewRepository } from '@src/v1/review/review.repository';
import { IReview, IReviewWithRelations } from '@src/v1/review/review.interface';
import { ReviewSnapshotRepository } from '@src/v1/review/review-snapshot.repository';
import { ReviewQueryRepository } from '@src/v1/review/review-query.repository';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { Pagination } from '@src/shared/types/pagination';
import { ReviewAdminService } from '@src/v1/review/review-admin.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewAdminService: ReviewAdminService,
    private readonly userService: UserService,
    private readonly reviewRepository: ReviewRepository,
    private readonly reviewSnapshotRepository: ReviewSnapshotRepository,
    private readonly reviewQueryRepository: ReviewQueryRepository,
    private readonly orderQueryRepository: OrderQueryRepository,
    private readonly drizzle: DrizzleService,
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
