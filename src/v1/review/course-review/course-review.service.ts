import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ReviewRepository } from '@src/v1/review/review.repository';
import { ReviewSnapshotRepository } from '@src/v1/review/review-snapshot.repository';
import { ReviewQueryRepository } from '@src/v1/review/review-query.repository';
import { OrderQueryRepository } from '@src/v1/order/order-query.repository';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ICourseReviewRelationsCreate } from '@src/v1/review/course-review/course-review.interface';
import { IReviewWithRelations } from '@src/v1/review/review.interface';
import { Pagination } from '@src/shared/types/pagination';
import { CourseReviewAdminService } from '@src/v1/review/course-review/course-review-admin.service';
import { CourseReviewRepository } from '@src/v1/review/course-review/course-review.repository';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';
import { Optional } from '@src/shared/types/optional';

@Injectable()
export class CourseReviewService {
  constructor(
    private readonly courseReviewAdminService: CourseReviewAdminService,
    private readonly reviewRepository: ReviewRepository,
    private readonly reviewSnapshotRepository: ReviewSnapshotRepository,
    private readonly courseReviewRepository: CourseReviewRepository,
    private readonly reviewQueryRepository: ReviewQueryRepository,
    private readonly orderQueryRepository: OrderQueryRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async findCourseReviewsByCourseId(
    where: Optional<
      Pick<ICourseReviewRelationsCreate, 'courseId' | 'userId'>,
      'userId'
    >,
    pagination: Pagination,
  ): Promise<IReviewWithRelations[]> {
    const reviews = await this.reviewQueryRepository.findManyWithCourseReviews({
      where,
      pagination,
    });

    return reviews;
  }

  async createCourseReviewByUser(
    params: ICourseReviewRelationsCreate,
  ): Promise<IReviewWithRelations> {
    const courseReviewRelations =
      await this.reviewQueryRepository.findCourseReview(params);

    const orderRelations =
      await this.orderQueryRepository.findCourseOrderByCourseId(params);

    const reviewWithSnapshot = await this.drizzle.db.transaction(async (tx) => {
      const review =
        courseReviewRelations?.review ??
        (await this.reviewRepository.createReview(
          {
            userId: params.userId,
            orderId: orderRelations?.id ?? null,
            productType: 'course',
          },
          tx,
        ));

      const courseReview =
        courseReviewRelations?.courseReview ??
        (await this.courseReviewRepository.createCourseReview(
          {
            reviewId: review.id,
            courseId: params.courseId,
            createdAt: review.createdAt,
          },
          tx,
        ));

      const snapshot = await this.reviewSnapshotRepository.create(
        {
          reviewId: review.id,
          comment: params.comment,
          rating: params.rating,
        },
        tx,
      );

      return { review, courseReview, snapshot };
    });

    console.log('[DEBUG] reviewWithSnapshot:', reviewWithSnapshot);

    const reviewWithReplies =
      await this.reviewQueryRepository.findOneWithReplies({
        id: reviewWithSnapshot.review.id,
        productType: reviewWithSnapshot.review.productType,
      });

    console.log('[DEBUG] reviewWithReplies:', reviewWithReplies);

    if (!reviewWithReplies) {
      throw new InternalServerErrorException('Failed to create review');
    }

    return reviewWithReplies;
  }

  async createCourseReview(
    user: IUserWithoutPassword,
    params: ICourseReviewRelationsCreate,
  ): Promise<IReviewWithRelations> {
    if (user?.role === 'admin' || user?.role === 'manager') {
      const mockCourseReview =
        await this.courseReviewAdminService.createCourseReviewByAdmin(params);
      return mockCourseReview;
    }

    return await this.createCourseReviewByUser(params);
  }
}
