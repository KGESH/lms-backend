import { Injectable } from '@nestjs/common';
import { OrderQueryRepository } from './order-query.repository';
import { IOrder } from './order.interface';
import { ICourseOrderRelations } from './course/course-order.interface';

@Injectable()
export class OrderService {
  constructor(private readonly orderQueryRepository: OrderQueryRepository) {}

  async findOrderById(
    where: Pick<IOrder, 'id'>,
  ): Promise<ICourseOrderRelations | null> {
    return await this.orderQueryRepository.findOne(where);
  }
}
