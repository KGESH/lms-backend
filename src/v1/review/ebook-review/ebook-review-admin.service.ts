import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ReviewRepository } from '@src/v1/review/review.repository';
import { ReviewSnapshotRepository } from '@src/v1/review/review-snapshot.repository';
import { ReviewQueryRepository } from '@src/v1/review/review-query.repository';
import { IEbookReviewRelationsCreate } from '@src/v1/review/ebook-review/ebook-review.interface';
import { EbookReviewRepository } from '@src/v1/review/ebook-review/ebook-review.repository';

@Injectable()
export class EbookReviewAdminService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly ebookReviewRepository: EbookReviewRepository,
    private readonly reviewQueryRepository: ReviewQueryRepository,
    private readonly reviewSnapshotRepository: ReviewSnapshotRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async createEbookReviewByAdmin(params: IEbookReviewRelationsCreate) {
    const { mockReview, mockEbookReview, mockReviewSnapshot } =
      await this.drizzle.db.transaction(async (tx) => {
        const mockReview = await this.reviewRepository.createReview(
          {
            orderId: null,
            userId: params.userId,
            productType: 'ebook',
          },
          tx,
        );
        const mockEbookReview =
          await this.ebookReviewRepository.createEbookReview(
            {
              ebookId: params.ebookId,
              reviewId: mockReview.id,
              createdAt: mockReview.createdAt,
            },
            tx,
          );
        const mockReviewSnapshot = await this.reviewSnapshotRepository.create(
          {
            reviewId: mockReview.id,
            comment: params.comment,
            rating: params.rating,
          },
          tx,
        );
        return { mockReview, mockEbookReview, mockReviewSnapshot };
      });

    const mockReviewWithReplies =
      await this.reviewQueryRepository.findOneWithReplies({
        id: mockReview.id,
        productType: mockReview.productType,
      });

    if (!mockReviewWithReplies) {
      throw new InternalServerErrorException('Failed to create mock review');
    }

    return mockReviewWithReplies;
  }
}
