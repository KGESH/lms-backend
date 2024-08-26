import { Injectable } from '@nestjs/common';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { OrderRepository } from '@src/v1/order/order.repository';
import { IOrder, IOrderCreate } from '@src/v1/order/order.interface';
import { EbookOrderRepository } from '@src/v1/order/ebook/ebook-order.repository';
import {
  IEbookOrder,
  IEbookOrderCreate,
} from '@src/v1/order/ebook/ebook-order.interface';
import { Uuid } from '@src/shared/types/primitive';
import { EbookEnrollmentRepository } from '@src/v1/ebook/enrollment/ebook-enrollment.repository';
import { IEbookEnrollment } from '@src/v1/ebook/enrollment/ebook-enrollment.interface';

@Injectable()
export class EbookOrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly ebookOrderRepository: EbookOrderRepository,
    private readonly ebookEnrollmentRepository: EbookEnrollmentRepository,
  ) {}

  async createEbookOrder(
    {
      ebookId,
      orderCreateParams,
      ebookOrderCreateParams,
    }: {
      ebookId: Uuid;
      orderCreateParams: IOrderCreate;
      ebookOrderCreateParams: IEbookOrderCreate;
    },
    tx: TransactionClient,
  ): Promise<{
    order: IOrder;
    ebookOrder: IEbookOrder;
    enrollment: IEbookEnrollment;
  }> {
    const order = await this.orderRepository.create(orderCreateParams, tx);

    const ebookOrder = await this.ebookOrderRepository.create(
      ebookOrderCreateParams,
      tx,
    );

    const enrollment =
      await this.ebookEnrollmentRepository.createEbookEnrollment({
        ebookId,
        userId: orderCreateParams.userId,
      });

    return { order, ebookOrder, enrollment };
  }
}
