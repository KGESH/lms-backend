import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ReviewRepository } from '@src/v1/review/review.repository';
import { ReviewSnapshotRepository } from '@src/v1/review/review-snapshot.repository';
import { EbookReviewRepository } from '@src/v1/review/ebook-review/ebook-review.repository';
import { MockReviewUserRepository } from '@src/v1/review/mock-review/mock-review-user.repository';
import { MockEbookReviewQueryRepository } from '@src/v1/review/mock-review/mock-ebook-review-query.repository';
import { IMockReviewCreate } from '@src/v1/review/mock-review/mock-review.interface';
import { Uuid } from '@src/shared/types/primitive';
import { Pagination } from '@src/shared/types/pagination';
import { IReviewWithRelations } from '@src/v1/review/review.interface';

@Injectable()
export class EbookReviewAdminService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly ebookReviewRepository: EbookReviewRepository,
    private readonly mockEbookReviewQueryRepository: MockEbookReviewQueryRepository,
    private readonly reviewSnapshotRepository: ReviewSnapshotRepository,
    private readonly mockReviewUserRepository: MockReviewUserRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async getMockEbookReviews(
    query: { ebookId?: Uuid },
    pagination: Pagination,
  ): Promise<IReviewWithRelations[]> {
    return await this.mockEbookReviewQueryRepository.findManyMockEbookReviews(
      query,
      pagination,
    );
  }

  async createEbookReviewByAdmin(ebookId: Uuid, params: IMockReviewCreate) {
    const {
      reviewCreateParams,
      reviewSnapshotCreateParams,
      mockUserCreateParams,
    } = params;
    const { mockReview, mockUser, mockEbookReview, mockReviewSnapshot } =
      await this.drizzle.db.transaction(async (tx) => {
        const mockReview = await this.reviewRepository.createReview(
          {
            orderId: null,
            userId: reviewCreateParams.userId,
            productType: 'ebook',
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
        const mockEbookReview =
          await this.ebookReviewRepository.createEbookReview(
            {
              ebookId,
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
        return { mockReview, mockUser, mockEbookReview, mockReviewSnapshot };
      });

    const mockReviewWithReplies =
      await this.mockEbookReviewQueryRepository.findMockEbookReview({
        id: mockReview.id,
      });

    if (!mockReviewWithReplies) {
      throw new InternalServerErrorException('Failed to create mock review');
    }

    return mockReviewWithReplies;
  }
}
