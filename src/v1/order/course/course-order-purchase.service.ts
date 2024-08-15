import { Injectable } from '@nestjs/common';
import { CourseOrderService } from './course-order.service';
import { DrizzleService } from '../../../infra/db/drizzle.service';
import { ICourseOrderPurchase } from './course-order-purchase.interface';
import { CourseProductService } from '../../product/course-product/course-product.service';
import { UserService } from '../../user/user.service';
import * as date from '../../../shared/utils/date';
import { ICourseOrder } from './course-order.interface';

@Injectable()
export class CourseOrderPurchaseService {
  constructor(
    private readonly userService: UserService,
    private readonly courseProductService: CourseProductService,
    private readonly courseOrderService: CourseOrderService,
    private readonly drizzle: DrizzleService,
  ) {}

  async purchaseCourse(
    params: Omit<ICourseOrderPurchase, 'paidAt'>,
  ): Promise<ICourseOrder> {
    const paidAt = date.now('date');
    const user = await this.userService.findUserByIdOrThrow({
      id: params.userId,
    });

    const courseProduct =
      await this.courseProductService.findCourseProductOrThrow({
        courseId: params.courseId,
      });

    return await this.drizzle.db.transaction(async (tx) => {
      return await this.courseOrderService.createCourseOrder(
        {
          userId: user.id,
          courseProductSnapshotId: courseProduct.lastSnapshot.id,
          paymentMethod: params.paymentMethod,
          amount: params.amount,
          paidAt,
        },
        tx,
      );
    });
  }

  async updateCourseOrderPaidAt(
    where: Pick<ICourseOrder, 'id'>,
  ): Promise<ICourseOrder> {
    return await this.courseOrderService.updateCourseOrder(where, {
      paidAt: date.now('date'),
    });
  }
}
