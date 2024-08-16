import { Injectable } from '@nestjs/common';
import { CourseOrderService } from './course-order.service';
import { DrizzleService } from '../../../infra/db/drizzle.service';
import { ICourseOrderPurchase } from './course-order-purchase.interface';
import { CourseProductService } from '../../product/course-product/course-product.service';
import { UserService } from '../../user/user.service';
import * as date from '../../../shared/utils/date';
import { ICourseOrder } from './course-order.interface';
import { ICourseProductWithRelations } from '../../product/course-product/course-product-relations.interface';
import { NonNullableInfer } from '../../../shared/types/non-nullable-infer';
import { IOrder } from '../order.interface';
import { createUuid } from '../../../shared/utils/uuid';

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
    const { order, courseOrder } = await this.drizzle.db.transaction(
      async (tx) => {
        return await this.courseOrderService.createCourseOrder(
          {
            orderCreateParams: {
              id: orderId,
              productType: 'course',
              userId: user.id,
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
      },
    );

    return { order, courseOrder, courseProduct };
  }
}
