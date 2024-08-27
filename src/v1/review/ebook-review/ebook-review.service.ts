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
import {
  IEbookReviewCreate,
  IEbookReviewRelationsCreate,
} from '@src/v1/review/ebook-review/ebook-review.interface';
import {
  IReview,
  IReviewCreate,
  IReviewWithRelations,
} from '@src/v1/review/review.interface';
import { Pagination } from '@src/shared/types/pagination';
import { EbookReviewRepository } from '@src/v1/review/ebook-review/ebook-review.repository';
import { createUuid } from '@src/shared/utils/uuid';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { EbookReviewAdminService } from '@src/v1/review/ebook-review/ebook-review-admin.service';

@Injectable()
export class EbookReviewService {
  constructor(
    private readonly ebookReviewAdminService: EbookReviewAdminService,
    private readonly userService: UserService,
    private readonly reviewRepository: ReviewRepository,
    private readonly ebookReviewRepository: EbookReviewRepository,
    private readonly reviewSnapshotRepository: ReviewSnapshotRepository,
    private readonly reviewQueryRepository: ReviewQueryRepository,
    private readonly orderQueryRepository: OrderQueryRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async findEbookReviewsByEbookId(
    where: Pick<IEbookReviewRelationsCreate, 'ebookId'>,
    pagination: Pagination,
  ): Promise<IReviewWithRelations[]> {
    const reviews = await this.reviewQueryRepository.findManyWithEbookReviews({
      where,
      pagination,
    });

    return reviews;
  }

  async createEbookReview(
    reviewCreateParams: IReviewCreate,
    ebookReviewCreateParams: Pick<IEbookReviewCreate, 'ebookId'>,
    tx: TransactionClient,
  ): Promise<IReview> {
    const reviewId = createUuid();
    const review = await this.reviewRepository.create(
      {
        ...reviewCreateParams,
        id: reviewId,
      },
      tx,
    );
    await this.ebookReviewRepository.createEbookReview(
      {
        ...ebookReviewCreateParams,
        reviewId,
        createdAt: review.createdAt,
      },
      tx,
    );

    return review;
  }

  async createEbookReviewByUser(
    params: IEbookReviewRelationsCreate,
  ): Promise<IReviewWithRelations> {
    const { ebookId, reviewCreateParams, snapshotCreateParams } = params;

    const orderWithReview = await this.orderQueryRepository.findOrderWithReview(
      {
        id: reviewCreateParams.orderId!,
        productType: reviewCreateParams.productType,
      },
    );

    let review = orderWithReview?.review;

    const reviewWithSnapshot = await this.drizzle.db.transaction(async (tx) => {
      review ??= await this.createEbookReview(
        reviewCreateParams,
        { ebookId },
        tx,
      );

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

  async createEbookReviewWithSnapshot(
    params: IEbookReviewRelationsCreate,
  ): Promise<IReviewWithRelations> {
    const user = await this.userService.findUserById({
      id: params.reviewCreateParams.userId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user?.role === 'admin' || user?.role === 'manager') {
      const mockEbookReview =
        await this.ebookReviewAdminService.createEbookReviewByAdmin(params);
      return mockEbookReview;
    }

    return await this.createEbookReviewByUser(params);
  }
}
