import { Injectable, NotFoundException } from '@nestjs/common';
import { ICourseOrder, ICourseOrderCreate } from './course-order.interface';
import { dbSchema } from '../../../infra/db/schema';
import { DrizzleService } from '../../../infra/db/drizzle.service';
import { eq } from 'drizzle-orm';

@Injectable()
export class CourseOrderRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findOne(where: Pick<ICourseOrder, 'id'>): Promise<ICourseOrder | null> {
    const courseOrder = await this.drizzle.db.query.courseOrders.findFirst({
      where: eq(dbSchema.courseOrders.id, where.id),
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
}
