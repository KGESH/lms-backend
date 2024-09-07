import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { OrderRepository } from '@src/v1/order/order.repository';
import { ReviewRepository } from '@src/v1/review/review.repository';
import { ReviewSnapshotRepository } from '@src/v1/review/review-snapshot.repository';
import { ReviewQueryRepository } from '@src/v1/review/review-query.repository';
import { createUuid } from '@src/shared/utils/uuid';
import * as date from '@src/shared/utils/date';
import * as typia from 'typia';
import { EbookProductService } from '@src/v1/product/ebook-product/ebook-product.service';
import { IEbookReviewRelationsCreate } from '@src/v1/review/ebook-review/ebook-review.interface';
import { EbookReviewRepository } from '@src/v1/review/ebook-review/ebook-review.repository';
import { IOrderCreate } from '@src/v1/order/order.interface';

@Injectable()
export class EbookReviewAdminService {
  constructor(
    private readonly ebookProductService: EbookProductService,
    private readonly orderRepository: OrderRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly ebookReviewRepository: EbookReviewRepository,
    private readonly reviewQueryRepository: ReviewQueryRepository,
    private readonly reviewSnapshotRepository: ReviewSnapshotRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async createEbookReviewByAdmin(params: IEbookReviewRelationsCreate) {
    const { ebookId, reviewCreateParams, snapshotCreateParams } = params;

    const product =
      await this.ebookProductService.findEbookProductWithRelationsOrThrow({
        ebookId,
      });

    const orderId = createUuid();
    const { mockOrder, mockReview, mockEbookReview, mockReviewSnapshot } =
      await this.drizzle.db.transaction(async (tx) => {
        const mockOrder = await this.orderRepository.create(
          {
            id: orderId,
            userId: reviewCreateParams.userId,
            txId: typia.random<IOrderCreate['txId']>(),
            paymentId: typia.random<IOrderCreate['paymentId']>(),
            productType: reviewCreateParams.productType,
            title: product.lastSnapshot!.title,
            description: product.lastSnapshot!.description,
            paymentMethod: 'admin',
            amount: product.lastSnapshot!.pricing.amount,
            paidAt: date.now('date'),
          },
          tx,
        );
        const mockReview = await this.reviewRepository.create(
          {
            ...reviewCreateParams,
            orderId: mockOrder.id,
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
            ...snapshotCreateParams,
            reviewId: mockReview.id,
          },
          tx,
        );
        return { mockOrder, mockReview, mockEbookReview, mockReviewSnapshot };
      });

    const mockReviewWithReplies =
      await this.reviewQueryRepository.findOneWithReplies({
        id: mockReview.id,
        productType: mockReview.productType,
      });

    if (!mockReviewWithReplies) {
      throw new InternalServerErrorException('Failed to create review');
    }

    return mockReviewWithReplies;
  }
}
