import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { CourseOrderService } from '@src/v1/order/course/course-order.service';
import { ICourseOrderPurchase } from '@src/v1/order/course/course-order-purchase.interface';
import { CourseProductService } from '@src/v1/product/course-product/course-product.service';
import { UserService } from '@src/v1/user/user.service';
import { ICourseOrder } from '@src/v1/order/course/course-order.interface';
import { ICourseProductWithRelations } from '@src/v1/product/course-product/course-product-relations.interface';
import { NonNullableInfer } from '@src/shared/types/non-nullable-infer';
import { IOrder } from '@src/v1/order/order.interface';
import { createUuid } from '@src/shared/utils/uuid';
import * as date from '@src/shared/utils/date';
import { ICourseEnrollment } from '@src/v1/course/enrollment/course-enrollment.interface';

@Injectable()
export class CourseOrderPurchaseService {
  constructor(
    private readonly userService: UserService,
    private readonly courseProductService: CourseProductService,
    private readonly courseOrderService: CourseOrderService,
    private readonly drizzle: DrizzleService,
  ) {}

  async purchaseCourse(params: Omit<ICourseOrderPurchase, 'paidAt'>): Promise<{
    order: IOrder;
    courseOrder: ICourseOrder;
    courseProduct: NonNullableInfer<ICourseProductWithRelations>;
    enrollment: ICourseEnrollment;
  }> {
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
  }
}
