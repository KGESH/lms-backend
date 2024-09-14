import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ReviewRepository } from '@src/v1/review/review.repository';
import { ReviewSnapshotRepository } from '@src/v1/review/review-snapshot.repository';
import { ReviewQueryRepository } from '@src/v1/review/review-query.repository';
import { OrderQueryRepository } from '@src/v1/order/order-query.repository';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IEbookReviewRelationsCreate } from '@src/v1/review/ebook-review/ebook-review.interface';
import { IReviewWithRelations } from '@src/v1/review/review.interface';
import { Pagination } from '@src/shared/types/pagination';
import { EbookReviewRepository } from '@src/v1/review/ebook-review/ebook-review.repository';
import { EbookReviewAdminService } from '@src/v1/review/ebook-review/ebook-review-admin.service';
import { Optional } from '@src/shared/types/optional';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';

@Injectable()
export class EbookReviewService {
  constructor(
    private readonly ebookReviewAdminService: EbookReviewAdminService,
    private readonly reviewRepository: ReviewRepository,
    private readonly ebookReviewRepository: EbookReviewRepository,
    private readonly reviewSnapshotRepository: ReviewSnapshotRepository,
    private readonly reviewQueryRepository: ReviewQueryRepository,
    private readonly orderQueryRepository: OrderQueryRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async findEbookReviewsByEbookId(
    where: Optional<
      Pick<IEbookReviewRelationsCreate, 'ebookId' | 'userId'>,
      'userId'
    >,
    pagination: Pagination,
  ): Promise<IReviewWithRelations[]> {
    const reviews = await this.reviewQueryRepository.findManyWithEbookReviews({
      where,
      pagination,
    });

    return reviews;
  }

  async createEbookReviewByUser(
    params: IEbookReviewRelationsCreate,
  ): Promise<IReviewWithRelations> {
    const ebookReviewRelations =
      await this.reviewQueryRepository.findEbookReview(params);

    const orderRelations =
      await this.orderQueryRepository.findEbookOrderByEbookId(params);

    const reviewWithSnapshot = await this.drizzle.db.transaction(async (tx) => {
      const review =
        ebookReviewRelations?.review ??
        (await this.reviewRepository.createReview(
          {
            userId: params.userId,
            orderId: orderRelations?.id ?? null,
            productType: 'ebook',
          },
          tx,
        ));

      const ebookReview =
        ebookReviewRelations?.ebookReview ??
        (await this.ebookReviewRepository.createEbookReview(
          {
            reviewId: review.id,
            ebookId: params.ebookId,
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

      return { review, ebookReview, snapshot };
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

  async createEbookReviewWithSnapshot(
    user: IUserWithoutPassword,
    params: IEbookReviewRelationsCreate,
  ): Promise<IReviewWithRelations> {
    if (user?.role === 'admin' || user?.role === 'manager') {
      const mockEbookReview =
        await this.ebookReviewAdminService.createEbookReviewByAdmin(params);
      return mockEbookReview;
    }

    return await this.createEbookReviewByUser(params);
  }
}
