import { Injectable } from '@nestjs/common';
import { IRepository } from '../../../core/base.repository';
import {
  ICourseOrder,
  ICourseOrderCreate,
  ICourseOrderUpdate,
} from './course-order.interface';
import { TransactionClient } from 'src/infra/db/drizzle.types';
import { IPagination } from 'src/shared/types/pagination';
import { dbSchema } from '../../../infra/db/schema';
import { DrizzleService } from '../../../infra/db/drizzle.service';
import { eq } from 'drizzle-orm';
import * as typia from 'typia';
import { Price } from '../../../shared/types/primitive';

@Injectable()
export class CourseOrderRepository implements IRepository<ICourseOrder> {
  constructor(private readonly drizzle: DrizzleService) {}

  findOne(where: Partial<ICourseOrder>): Promise<ICourseOrder | null> {
    throw new Error('Method not implemented.');
  }

  findOneOrThrow(where: Partial<ICourseOrder>): Promise<ICourseOrder> {
    throw new Error('Method not implemented.');
  }

  findMany(pagination: IPagination): Promise<ICourseOrder[]> {
    throw new Error('Method not implemented.');
  }

  async create(
    params: ICourseOrderCreate,
    db = this.drizzle.db,
  ): Promise<ICourseOrder> {
    const [courseOrder] = await db
      .insert(dbSchema.courseOrders)
      .values(params)
      .returning();

    return {
      ...courseOrder,
      amount: typia.assert<Price>(courseOrder.amount),
    };
  }

  async update(
    where: Pick<ICourseOrder, 'id'>,
    params: ICourseOrderUpdate,
    db = this.drizzle.db,
  ): Promise<ICourseOrder> {
    const [updated] = await db
      .update(dbSchema.courseOrders)
      .set(params)
      .where(eq(dbSchema.courseOrders.id, where.id))
      .returning();

    return {
      ...updated,
      amount: typia.assert<Price>(updated.amount),
    };
  }

  delete(
    where: Partial<ICourseOrder>,
    db: TransactionClient,
  ): Promise<ICourseOrder> {
    throw new Error('Method not implemented.');
  }
}
