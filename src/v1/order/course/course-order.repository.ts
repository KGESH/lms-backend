import { Injectable, NotFoundException } from '@nestjs/common';
import { IRepository } from '../../../core/base.repository';
import { ICourseOrder, ICourseOrderCreate } from './course-order.interface';
import { TransactionClient } from 'src/infra/db/drizzle.types';
import { IPagination } from 'src/shared/types/pagination';
import { dbSchema } from '../../../infra/db/schema';
import { DrizzleService } from '../../../infra/db/drizzle.service';
import { eq } from 'drizzle-orm';

@Injectable()
export class CourseOrderRepository implements IRepository<ICourseOrder> {
  constructor(private readonly drizzle: DrizzleService) {}

  async findOne(where: Pick<ICourseOrder, 'id'>): Promise<ICourseOrder | null> {
    const courseOrder = await this.drizzle.db.query.courseOrders.findFirst({
      where: eq(dbSchema.courseOrders.id, where.id),
      with: {},
    });

    if (!courseOrder) {
      return null;
    }

    return courseOrder;
  }

  async findOneOrThrow(where: Pick<ICourseOrder, 'id'>): Promise<ICourseOrder> {
    const order = await this.findOne(where);

    if (!order) {
      throw new NotFoundException(`CourseOrder not found`);
    }

    return order;
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

    return courseOrder;
  }

  async update(
    where: Pick<ICourseOrder, 'id'>,
    params: Partial<ICourseOrder>,
    db = this.drizzle.db,
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
