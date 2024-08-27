import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CourseProductService } from '@src/v1/product/course-product/course-product.service';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { OrderRepository } from '@src/v1/order/order.repository';
import { IReviewWithRelations } from '@src/v1/review/review.interface';
import { ReviewRepository } from '@src/v1/review/review.repository';
import { ReviewSnapshotRepository } from '@src/v1/review/review-snapshot.repository';
import { ICourseReviewCreate } from '@src/v1/review/course-review/course-review.interface';
import { ReviewQueryRepository } from '@src/v1/review/review-query.repository';
import { createUuid } from '@src/shared/utils/uuid';
import * as date from '@src/shared/utils/date';
import { EbookProductService } from '@src/v1/product/ebook-product/ebook-product.service';
import { IEbookReviewCreate } from '@src/v1/review/ebook-review/ebook-review.interface';

@Injectable()
export class ReviewAdminService {
  constructor(
    private readonly courseProductService: CourseProductService,
    private readonly ebookProductService: EbookProductService,
    private readonly orderRepository: OrderRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly reviewQueryRepository: ReviewQueryRepository,
    private readonly reviewSnapshotRepository: ReviewSnapshotRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async createCourseReviewByAdmin(
    params: ICourseReviewCreate,
  ): Promise<IReviewWithRelations> {
    const { courseId, reviewCreateParams, snapshotCreateParams } = params;

    const product =
      await this.courseProductService.findCourseProductWithRelationsOrThrow({
        courseId,
      });

    const orderId = createUuid();
    const { mockOrder, mockReview, mockReviewSnapshot } =
      await this.drizzle.db.transaction(async (tx) => {
        const mockOrder = await this.orderRepository.create(
          {
            id: orderId,
            userId: reviewCreateParams.userId,
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
        const mockReviewSnapshot = await this.reviewSnapshotRepository.create(
          {
            ...snapshotCreateParams,
            reviewId: mockReview.id,
          },
          tx,
        );
        return { mockOrder, mockReview, mockReviewSnapshot };
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

  async createEbookReviewByAdmin(params: IEbookReviewCreate) {
    const { ebookId, reviewCreateParams, snapshotCreateParams } = params;

    const product =
      await this.ebookProductService.findEbookProductWithRelationsOrThrow({
        ebookId,
      });

    const orderId = createUuid();
    const { mockOrder, mockReview, mockReviewSnapshot } =
      await this.drizzle.db.transaction(async (tx) => {
        const mockOrder = await this.orderRepository.create(
          {
            id: orderId,
            userId: reviewCreateParams.userId,
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
        const mockReviewSnapshot = await this.reviewSnapshotRepository.create(
          {
            ...snapshotCreateParams,
            reviewId: mockReview.id,
          },
          tx,
        );
        return { mockOrder, mockReview, mockReviewSnapshot };
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
