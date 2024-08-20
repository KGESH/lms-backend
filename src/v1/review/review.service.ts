import { Injectable, NotFoundException } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import {
  IReview,
  IReviewCreate,
  IReviewSnapshotCreate,
  IReviewWithRelations,
} from './review.interface';
import { ReviewSnapshotRepository } from './review-snapshot.repository';
import { ReviewQueryRepository } from './review-query.repository';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { OrderQueryRepository } from '../order/order-query.repository';
import { UserService } from '../user/user.service';
import { Pagination } from '../../shared/types/pagination';
import { DEFAULT_PAGINATION } from '../../core/pagination.constant';
import { ReviewAdminService } from './review-admin.service';
import { Uuid } from '../../shared/types/primitive';
import { ICourseReviewCreate } from './course-review/course-review.interface';

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

    return {
      ...reviewWithSnapshot.review,
      snapshot: {
        ...reviewWithSnapshot.snapshot,
        replies: [],
      },
    };
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
