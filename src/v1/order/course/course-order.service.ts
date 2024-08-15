import { Injectable } from '@nestjs/common';
import { CourseOrderRepository } from './course-order.repository';
import { TransactionClient } from '../../../infra/db/drizzle.types';
import {
  ICourseOrder,
  ICourseOrderCreate,
  ICourseOrderUpdate,
} from './course-order.interface';

@Injectable()
export class CourseOrderService {
  constructor(private readonly courseOrderRepository: CourseOrderRepository) {}

  async createCourseOrder(
    params: ICourseOrderCreate,
    tx: TransactionClient,
  ): Promise<ICourseOrder> {
    return await this.courseOrderRepository.create(params, tx);
  }

  async updateCourseOrder(
    where: Pick<ICourseOrder, 'id'>,
    params: ICourseOrderUpdate,
    tx?: TransactionClient,
  ): Promise<ICourseOrder> {
    return await this.courseOrderRepository.update(where, params, tx);
  }
}
