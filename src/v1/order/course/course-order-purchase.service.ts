import { Injectable, Logger } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { CourseOrderService } from '@src/v1/order/course/course-order.service';
import { ICourseOrderPurchase } from '@src/v1/order/course/course-order-purchase.interface';
import { CourseProductService } from '@src/v1/product/course-product/course-product.service';
import { UserService } from '@src/v1/user/user.service';
import { ICourseOrder } from '@src/v1/order/course/course-order.interface';
import { ICourseProductWithLastSnapshot } from '@src/v1/product/course-product/course-product-relations.interface';
import { NonNullableInfer } from '@src/shared/types/non-nullable-infer';
import { IOrder } from '@src/v1/order/order.interface';
import { createUuid } from '@src/shared/utils/uuid';
import * as date from '@src/shared/utils/date';
import { ICourseEnrollment } from '@src/v1/course/enrollment/course-enrollment.interface';
import { PaymentService } from '@src/infra/payment/payment.service';

@Injectable()
export class CourseOrderPurchaseService {
  private readonly logger = new Logger(CourseOrderPurchaseService.name);
  constructor(
    private readonly userService: UserService,
    private readonly courseProductService: CourseProductService,
    private readonly courseOrderService: CourseOrderService,
    private readonly paymentService: PaymentService,
    private readonly drizzle: DrizzleService,
  ) {}

  async purchaseCourse(params: Omit<ICourseOrderPurchase, 'paidAt'>): Promise<{
    order: IOrder;
    courseOrder: ICourseOrder;
    courseProduct: NonNullableInfer<ICourseProductWithLastSnapshot>;
    enrollment: ICourseEnrollment;
  }> {
    try {
      // Verify payment amount mismatch
      if (params.paymentId) {
        const pgPaymentResult = await this.paymentService.getPgPaymentResult(
          params.paymentId,
        );
        this.paymentService.verifyPaymentOrThrow({
          pgAmount: pgPaymentResult.amount.total,
          appAmount: params.amount,
        });
      }

      const paidAt = date.now('date');

      const user = await this.userService.findUserByIdOrThrow({
        id: params.userId,
      });

      const courseProduct =
        await this.courseProductService.findCourseProductOrThrow({
          courseId: params.courseId,
        });

      const orderId = createUuid();

      const { order, courseOrder, enrollment } =
        await this.drizzle.db.transaction(async (tx) => {
          return await this.courseOrderService.createCourseOrder(
            {
              courseId: params.courseId,
              orderCreateParams: {
                id: orderId,
                userId: user.id,
                paymentId: params.paymentId,
                txId: params.txId,
                productType: 'course',
                title: courseProduct.lastSnapshot.title,
                description: courseProduct.lastSnapshot.description,
                paymentMethod: params.paymentMethod,
                amount: params.amount,
                paidAt,
              },
              courseOrderCreateParams: {
                orderId,
                productSnapshotId: courseProduct.lastSnapshot.id,
              },
            },
            tx,
          );
        });
      return { order, courseOrder, courseProduct, enrollment };
    } catch (e) {
      // If something wrong(failed), refund payment
      this.logger.error(e);
      if (params.paymentId) {
        await this.paymentService.refundPgPayment({
          paymentId: params.paymentId,
          reason: '결제 도중 오류로 인한 환불',
        });
      }
      throw e;
    }
  }
}
