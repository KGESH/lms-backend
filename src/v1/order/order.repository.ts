import { Injectable } from '@nestjs/common';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import * as typia from 'typia';
import { IOrder, IOrderCreate } from '@src/v1/order/order.interface';

@Injectable()
export class OrderRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(params: IOrderCreate, db = this.drizzle.db): Promise<IOrder> {
    const [order] = await db.insert(dbSchema.orders).values(params).returning();
    return typia.assert<IOrder>(order);
  }
}
