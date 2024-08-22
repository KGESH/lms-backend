import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  ICourseOrder,
  ICourseOrderCreate,
} from '@src/v1/order/course/course-order.interface';

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
