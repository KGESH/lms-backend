import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ReviewRepository } from '@src/v1/review/review.repository';
import { ReviewSnapshotRepository } from '@src/v1/review/review-snapshot.repository';
import { ReviewQueryRepository } from '@src/v1/review/review-query.repository';
import { OrderQueryRepository } from '@src/v1/order/order-query.repository';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ICourseReviewRelationsCreate } from '@src/v1/review/course-review/course-review.interface';
import {
  IReview,
  IReviewSnapshot,
  IReviewWithRelations,
} from '@src/v1/review/review.interface';
import { Paginated, Pagination } from '@src/shared/types/pagination';
import { CourseReviewRepository } from '@src/v1/review/course-review/course-review.repository';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';
import { Optional, OptionalPick } from '@src/shared/types/optional';
import { IDeleteEntityMetadata } from '@src/core/delete-entity-metadata.interface';

@Injectable()
export class CourseReviewService {
  constructor(
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
  ): Promise<Paginated<IReviewWithRelations[]>> {
    const reviews = await this.reviewQueryRepository.findManyWithCourseReviews({
      where,
      pagination,
    });

    return reviews;
  }

  async createCourseReview(
    params: ICourseReviewRelationsCreate,
  ): Promise<IReviewWithRelations> {
    const courseReviewRelations =
      await this.reviewQueryRepository.findCourseReview({
        userId: params.userId,
        courseId: params.courseId,
      });

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

  async updateCourseReview(
    user: IUserWithoutPassword,
    where: Pick<IReview, 'id' | 'productType'>,
    params: OptionalPick<IReviewSnapshot, 'comment' | 'rating'>,
  ): Promise<IReviewWithRelations> {
    const reviewWithReplies =
      await this.reviewQueryRepository.findOneWithReplies(where);

    if (!reviewWithReplies || reviewWithReplies.userId !== user.id) {
      throw new NotFoundException('Review not found');
    }

    await this.reviewSnapshotRepository.create({
      reviewId: reviewWithReplies.id,
      comment: params.comment ?? reviewWithReplies.snapshot.comment,
      rating: params.rating ?? reviewWithReplies.snapshot.rating,
    });

    const updated = await this.reviewQueryRepository.findOneWithReplies(where);

    if (!updated) {
      throw new InternalServerErrorException('Failed to update review');
    }

    return updated;
  }

  async deleteCourseReview(
    user: IUserWithoutPassword,
    where: Pick<IReview, 'id' | 'productType'>,
  ): Promise<Pick<IReview, 'id'>> {
    const review = await this.reviewQueryRepository.findOneWithReplies(where);

    // Review not found or user is not the owner of the review
    if (!review || (user.role === 'user' && review.userId !== user.id)) {
      throw new NotFoundException('Review not found');
    }

    if (user.role === 'user') {
      return await this.reviewRepository.deleteReview(review);
    }

    const metadata: IDeleteEntityMetadata = {
      deletedBy: user.id,
      deletedReason: `Deleted by [${user.id}]`,
    };

    return await this.reviewRepository.deleteReview(review, metadata);
  }
}
