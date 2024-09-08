import { Injectable, Logger } from '@nestjs/common';
import { OrderQueryRepository } from '@src/v1/order/order-query.repository';
import { IOrder } from '@src/v1/order/order.interface';
import {
  IOrderRefund,
  IOrderRefundCreate,
} from '@src/v1/order/order-refund.interface';
import { OrderRefundRepository } from '@src/v1/order/order-refund.repository';
import * as date from '@src/shared/utils/date';
import { IOrderRelations } from '@src/v1/order/order-relations.interface';
import { PaymentService } from '@src/infra/payment/payment.service';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  constructor(
    private readonly paymentService: PaymentService,
    private readonly orderQueryRepository: OrderQueryRepository,
    private readonly orderRefundRepository: OrderRefundRepository,
  ) {}

  async findOrderWithRelations(
    where: Pick<IOrder, 'id'>,
  ): Promise<IOrderRelations | null> {
    const order = await this.orderQueryRepository.findOrder(where);

    if (!order) {
      return null;
    }

    if (order.productType === 'course') {
      return await this.orderQueryRepository.findOrderWithCourseRelationsOrThrow(
        where,
      );
    } else {
      return await this.orderQueryRepository.findOrderWithEbookRelationsOrThrow(
        where,
      );
    }
  }

  async refundOrder(
    where: Pick<IOrder, 'id'>,
    refundCreateParams: Omit<IOrderRefundCreate, 'refundedAt'>,
  ): Promise<IOrderRefund> {
    const order = await this.orderQueryRepository.findOrderOrThrow(where);

    if (order.paymentId) {
      const pgRefundResponse = await this.paymentService.refundPgPayment({
        paymentId: order.paymentId,
        reason: refundCreateParams.reason,
        refundAmount: +refundCreateParams.refundedAmount,
      });
      this.logger.log(`[PG refund response]`, pgRefundResponse);
    }

    const refundedAt = date.now('date');

    const orderRefund = await this.orderRefundRepository.create({
      ...refundCreateParams,
      orderId: order.id,
      refundedAt,
    });

    return orderRefund;
  }
}
