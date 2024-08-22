import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OrderQueryRepository } from '@src/v1/order/order-query.repository';
import { UserService } from '@src/v1/user/user.service';
import { ReviewRepository } from '@src/v1/review/review.repository';
import { IReview, IReviewWithRelations } from '@src/v1/review/review.interface';
import { ReviewSnapshotRepository } from '@src/v1/review/review-snapshot.repository';
import { ReviewQueryRepository } from '@src/v1/review/review-query.repository';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { Pagination } from '@src/shared/types/pagination';
import { DEFAULT_PAGINATION } from '@src/core/pagination.constant';
import { ReviewAdminService } from '@src/v1/review/review-admin.service';
import { ICourseReviewCreate } from '@src/v1/review/course-review/course-review.interface';

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
    pagination: Pagination = DEFAULT_PAGINATION,
  ): Promise<IReviewWithRelations[]> {
    return await this.reviewQueryRepository.findManyWithReplies(
      where,
      pagination,
    );
  }

  async createCourseReviewByUser(
    params: Omit<ICourseReviewCreate, 'courseId'>,
  ): Promise<IReviewWithRelations> {
    const { reviewCreateParams, snapshotCreateParams } = params;

    const orderWithReview = await this.orderQueryRepository.findOrderWithReview(
      {
        id: reviewCreateParams.orderId!,
        productType: reviewCreateParams.productType,
      },
    );

    let review = orderWithReview?.review;

    const reviewWithSnapshot = await this.drizzle.db.transaction(async (tx) => {
      review ??= await this.reviewRepository.create(reviewCreateParams, tx);
      const snapshot = await this.reviewSnapshotRepository.create(
        {
          ...snapshotCreateParams,
          reviewId: review.id,
        },
        tx,
      );

      return { review, snapshot };
    });

    const reviewWithReplies =
      await this.reviewQueryRepository.findOneWithReplies({
        id: reviewWithSnapshot.review.id,
        productType: reviewWithSnapshot.review.productType,
      });

    if (!reviewWithReplies) {
      throw new InternalServerErrorException('Failed to create review');
    }

    return reviewWithReplies;
  }

  async createCourseReview(
    params: ICourseReviewCreate,
  ): Promise<IReviewWithRelations> {
    const user = await this.userService.findUserById({
      id: params.reviewCreateParams.userId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user?.role === 'admin' || user?.role === 'manager') {
      const mockCourseReview =
        await this.reviewAdminService.createCourseReviewByAdmin(params);
      return mockCourseReview;
    }

    return await this.createCourseReviewByUser(params);
  }
}
