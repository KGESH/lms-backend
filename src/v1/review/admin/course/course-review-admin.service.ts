import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ReviewRepository } from '@src/v1/review/review.repository';
import { ReviewSnapshotRepository } from '@src/v1/review/review-snapshot.repository';
import { MockReviewUserRepository } from '@src/v1/review/mock-review/mock-review-user.repository';
import { MockCourseReviewQueryRepository } from '@src/v1/review/mock-review/mock-course-review-query.repository';
import { Uuid } from '@src/shared/types/primitive';
import {
  IMockReviewCreate,
  IMockReviewUpdate,
} from '@src/v1/review/mock-review/mock-review.interface';
import { CourseReviewRepository } from '@src/v1/review/course-review/course-review.repository';
import { Pagination } from '@src/shared/types/pagination';
import { IReviewWithRelations } from '@src/v1/review/review.interface';
import { MockReviewRepository } from '@src/v1/review/mock-review/mock-review.repository';

@Injectable()
export class CourseReviewAdminService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly courseReviewRepository: CourseReviewRepository,
    private readonly mockCourseReviewQueryRepository: MockCourseReviewQueryRepository,
    private readonly reviewSnapshotRepository: ReviewSnapshotRepository,
    private readonly mockReviewRepository: MockReviewRepository,
    private readonly mockReviewUserRepository: MockReviewUserRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async getMockCourseReviews(
    query: { courseId?: Uuid },
    pagination: Pagination,
  ): Promise<IReviewWithRelations[]> {
    return await this.mockCourseReviewQueryRepository.findManyMockCourseReviews(
      query,
      pagination,
    );
  }

  async createCourseReviewByAdmin(
    courseId: Uuid,
    params: IMockReviewCreate,
  ): Promise<IReviewWithRelations> {
    const {
      reviewCreateParams,
      reviewSnapshotCreateParams,
      mockUserCreateParams,
    } = params;
    const { mockReview, mockUser, mockCourseReview, mockReviewSnapshot } =
      await this.drizzle.db.transaction(async (tx) => {
        const mockReview = await this.reviewRepository.createReview(
          {
            orderId: null,
            userId: reviewCreateParams.userId,
            productType: 'course',
          },
          tx,
        );
        const mockUser =
          await this.mockReviewUserRepository.createMockReviewUser(
            {
              reviewId: mockReview.id,
              displayName: mockUserCreateParams.displayName,
              email: mockUserCreateParams.email,
              image: mockUserCreateParams.image,
            },
            tx,
          );
        const mockCourseReview =
          await this.courseReviewRepository.createCourseReview(
            {
              courseId,
              reviewId: mockReview.id,
              createdAt: mockReview.createdAt,
            },
            tx,
          );
        const mockReviewSnapshot = await this.reviewSnapshotRepository.create(
          {
            reviewId: mockReview.id,
            comment: reviewSnapshotCreateParams.comment,
            rating: reviewSnapshotCreateParams.rating,
          },
          tx,
        );
        return { mockReview, mockUser, mockCourseReview, mockReviewSnapshot };
      });

    const mockReviewWithReplies =
      await this.mockCourseReviewQueryRepository.findMockCourseReview({
        id: mockReview.id,
      });

    if (!mockReviewWithReplies) {
      throw new InternalServerErrorException('Failed to create mock review');
    }

    return mockReviewWithReplies;
  }

  async updateCourseReviewByAdmin({
    reviewId,
    reviewSnapshotUpdateParams,
    mockUserCreateParams,
  }: IMockReviewUpdate): Promise<IReviewWithRelations> {
    const mockReviewWithReplies =
      await this.mockCourseReviewQueryRepository.findMockCourseReview({
        id: reviewId,
      });

    if (!mockReviewWithReplies) {
      throw new NotFoundException('Review not found');
    }

    await this.drizzle.db.transaction(async (tx) => {
      if (mockUserCreateParams) {
        await this.mockReviewUserRepository.updateMockReviewUser(
          { id: mockReviewWithReplies.user.id },
          {
            displayName:
              mockUserCreateParams?.displayName ??
              mockReviewWithReplies.user.displayName,
            email:
              mockUserCreateParams?.email ?? mockReviewWithReplies.user.email,
            image:
              mockUserCreateParams?.image ?? mockReviewWithReplies.user.image,
          },
          tx,
        );
      }

      if (reviewSnapshotUpdateParams) {
        await this.reviewSnapshotRepository.create(
          {
            reviewId,
            comment:
              reviewSnapshotUpdateParams?.comment ??
              mockReviewWithReplies.snapshot.comment,
            rating:
              reviewSnapshotUpdateParams?.rating ??
              mockReviewWithReplies.snapshot.rating,
          },
          tx,
        );
      }
    });

    const updated =
      await this.mockCourseReviewQueryRepository.findMockCourseReview({
        id: reviewId,
      });

    if (!updated) {
      throw new InternalServerErrorException('Failed to update review');
    }

    return updated;
  }

  async deleteCourseReviewByAdmin(reviewId: Uuid): Promise<Uuid> {
    const deletedReviewId = await this.drizzle.db.transaction(async (tx) => {
      return await this.mockReviewRepository.deleteMockReview(
        { id: reviewId },
        tx,
      );
    });

    return deletedReviewId;
  }
}
