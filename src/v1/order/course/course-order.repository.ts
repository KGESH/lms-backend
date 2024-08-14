import { Injectable } from '@nestjs/common';
import { IRepository } from '../../../core/base.repository';
import { ICourseOrder } from './course-order.interface';
import { TransactionClient } from 'src/infra/db/drizzle.types';
import { IPagination } from 'src/shared/types/pagination';

@Injectable()
export class CourseOrderRepository implements IRepository<ICourseOrder> {
  findOne(where: Partial<ICourseOrder>): Promise<ICourseOrder | null> {
    throw new Error('Method not implemented.');
  }
  findOneOrThrow(where: Partial<ICourseOrder>): Promise<ICourseOrder> {
    throw new Error('Method not implemented.');
  }
  findMany(pagination: IPagination): Promise<ICourseOrder[]> {
    throw new Error('Method not implemented.');
  }
  create(params: unknown, db: TransactionClient): Promise<ICourseOrder> {
    throw new Error('Method not implemented.');
  }
  update(
    where: Partial<ICourseOrder>,
    params: Partial<ICourseOrder>,
    db: TransactionClient,
  ): Promise<ICourseOrder> {
    throw new Error('Method not implemented.');
  }
  delete(
    where: Partial<ICourseOrder>,
    db: TransactionClient,
  ): Promise<ICourseOrder> {
    throw new Error('Method not implemented.');
  }
}
