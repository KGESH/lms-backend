import { Injectable } from '@nestjs/common';
import { OrderQueryRepository } from '@src/v1/order/order-query.repository';
import { IOrder } from '@src/v1/order/order.interface';
import { ICourseOrderRelations } from '@src/v1/order/course/course-order.interface';
import {
  IOrderRefund,
  IOrderRefundCreate,
} from '@src/v1/order/order-refund.interface';
import { OrderRefundRepository } from '@src/v1/order/order-refund.repository';
import * as date from '@src/shared/utils/date';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderQueryRepository: OrderQueryRepository,
    private readonly orderRefundRepository: OrderRefundRepository,
  ) {}

  async findOrderById(
    where: Pick<IOrder, 'id'>,
  ): Promise<ICourseOrderRelations | null> {
    return await this.orderQueryRepository.findOrderWithCourseRelations(where);
  }

  async refundOrder(
    where: Pick<IOrder, 'id'>,
    refundCreateParams: Omit<IOrderRefundCreate, 'refundedAt'>,
  ): Promise<IOrderRefund> {
    const order = await this.orderQueryRepository.findOrderOrThrow(where);

    // Todo: Impl payment refund

    const refundedAt = date.now('date');
    const orderRefund = await this.orderRefundRepository.create({
      ...refundCreateParams,
      orderId: order.id,
      refundedAt,
    });

    return orderRefund;
  }
}
