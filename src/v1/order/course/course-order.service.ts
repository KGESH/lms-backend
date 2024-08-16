import { Injectable } from '@nestjs/common';
import { CourseOrderRepository } from './course-order.repository';
import { TransactionClient } from '../../../infra/db/drizzle.types';
import { ICourseOrder, ICourseOrderCreate } from './course-order.interface';
import { OrderRepository } from '../order.repository';
import { IOrder, IOrderCreate } from '../order.interface';

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
