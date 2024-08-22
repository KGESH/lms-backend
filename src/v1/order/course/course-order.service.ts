import { Injectable } from '@nestjs/common';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { OrderRepository } from '@src/v1/order/order.repository';
import { IOrder, IOrderCreate } from '@src/v1/order/order.interface';
import { CourseOrderRepository } from '@src/v1/order/course/course-order.repository';
import {
  ICourseOrder,
  ICourseOrderCreate,
} from '@src/v1/order/course/course-order.interface';

@Injectable()
export class CourseOrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly courseOrderRepository: CourseOrderRepository,
  ) {}

  async createCourseOrder(
    {
      orderCreateParams,
      courseOrderCreateParams,
    }: {
      orderCreateParams: IOrderCreate;
      courseOrderCreateParams: ICourseOrderCreate;
    },
    tx: TransactionClient,
  ): Promise<{
    order: IOrder;
    courseOrder: ICourseOrder;
  }> {
    const order = await this.orderRepository.create(orderCreateParams, tx);

    const courseOrder = await this.courseOrderRepository.create(
      courseOrderCreateParams,
      tx,
    );

    return { order, courseOrder };
  }
}
