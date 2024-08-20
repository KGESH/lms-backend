import { Injectable, NotFoundException } from '@nestjs/common';
import { IReviewWithRelations } from './review.interface';
import { ReviewRepository } from './review.repository';
import { ReviewSnapshotRepository } from './review-snapshot.repository';
import { OrderQueryRepository } from '../order/order-query.repository';
import { OrderRepository } from '../order/order.repository';
import { createUuid } from '../../shared/utils/uuid';
import * as date from '../../shared/utils/date';
import { CourseProductService } from '../product/course-product/course-product.service';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { ICourseReviewCreate } from './course-review/course-review.interface';

@Injectable()
export class ReviewAdminService {
  constructor(
    private readonly courseProductService: CourseProductService,
    private readonly orderRepository: OrderRepository,
    private readonly orderQueryRepository: OrderQueryRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly reviewSnapshotRepository: ReviewSnapshotRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async createCourseReviewByAdmin(
    params: ICourseReviewCreate,
  ): Promise<IReviewWithRelations> {
    const { courseId, reviewCreateParams, snapshotCreateParams } = params;

    const product = await this.courseProductService.findCourseProduct({
      courseId,
    });

    if (!product?.lastSnapshot) {
      throw new NotFoundException('Course product not found');
    }

    const orderId = createUuid();
    const { mockOrder, mockReview, mockReviewSnapshot } =
      await this.drizzle.db.transaction(async (tx) => {
        const mockOrder = await this.orderRepository.create(
          {
            id: orderId,
            userId: reviewCreateParams.userId,
            productType: reviewCreateParams.productType,
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

    return {
      ...mockReview,
      snapshot: {
        ...mockReviewSnapshot,
        replies: [],
      },
    };
  }
}
