import { Injectable } from '@nestjs/common';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { OrderRepository } from '@src/v1/order/order.repository';
import { IOrder, IOrderCreate } from '@src/v1/order/order.interface';
import { CourseOrderRepository } from '@src/v1/order/course/course-order.repository';
import {
  ICourseOrder,
  ICourseOrderCreate,
} from '@src/v1/order/course/course-order.interface';
import { Uuid } from '@src/shared/types/primitive';
import { CourseEnrollmentRepository } from '@src/v1/course/enrollment/course-enrollment.repository';
import { ICourseEnrollment, ICourseEnrollmentCreate } from '@src/v1/course/enrollment/course-enrollment.interface';

@Injectable()
export class CourseOrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly courseOrderRepository: CourseOrderRepository,
    private readonly courseEnrollmentRepository: CourseEnrollmentRepository,
  ) {}

  async createCourseOrder(
    {
      courseId,
      orderCreateParams,
      courseOrderCreateParams,
      validUntil,
    }: {
      courseId: Uuid;
      orderCreateParams: IOrderCreate;
      courseOrderCreateParams: ICourseOrderCreate;
      validUntil: ICourseEnrollmentCreate['validUntil'];
    },
    tx: TransactionClient,
  ): Promise<{
    order: IOrder;
    courseOrder: ICourseOrder;
    enrollment: ICourseEnrollment;
  }> {
    const order = await this.orderRepository.create(orderCreateParams, tx);

    const courseOrder = await this.courseOrderRepository.create(
      courseOrderCreateParams,
      tx,
    );

    const enrollment =
      await this.courseEnrollmentRepository.createCourseEnrollment({
        courseId,
        userId: orderCreateParams.userId,
        validUntil,
      });

    return { order, courseOrder, enrollment };
  }
}
