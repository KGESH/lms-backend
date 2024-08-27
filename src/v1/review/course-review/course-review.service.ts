import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '@src/v1/user/user.service';
import { ReviewRepository } from '@src/v1/review/review.repository';
import { ReviewSnapshotRepository } from '@src/v1/review/review-snapshot.repository';
import { ReviewQueryRepository } from '@src/v1/review/review-query.repository';
import { OrderQueryRepository } from '@src/v1/order/order-query.repository';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ICourseReviewRelationsCreate } from '@src/v1/review/course-review/course-review.interface';
import { IReviewWithRelations } from '@src/v1/review/review.interface';
import { Pagination } from '@src/shared/types/pagination';
import { CourseReviewAdminService } from '@src/v1/review/course-review/course-review-admin.service';

@Injectable()
export class CourseReviewService {
  constructor(
    private readonly courseReviewAdminService: CourseReviewAdminService,
    private readonly userService: UserService,
    private readonly reviewRepository: ReviewRepository,
    private readonly reviewSnapshotRepository: ReviewSnapshotRepository,
    private readonly reviewQueryRepository: ReviewQueryRepository,
    private readonly orderQueryRepository: OrderQueryRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async findCourseReviewsByCourseId(
    where: Pick<ICourseReviewRelationsCreate, 'courseId'>,
    pagination: Pagination,
  ): Promise<IReviewWithRelations[]> {
    const reviews = await this.reviewQueryRepository.findManyWithCourseReviews({
      where,
      pagination,
    });

    return reviews;
  }

  async createCourseReviewByUser(
    params: Omit<ICourseReviewRelationsCreate, 'courseId'>,
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
    params: ICourseReviewRelationsCreate,
  ): Promise<IReviewWithRelations> {
    const user = await this.userService.findUserById({
      id: params.reviewCreateParams.userId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user?.role === 'admin' || user?.role === 'manager') {
      const mockCourseReview =
        await this.courseReviewAdminService.createCourseReviewByAdmin(params);
      return mockCourseReview;
    }

    return await this.createCourseReviewByUser(params);
  }
}
