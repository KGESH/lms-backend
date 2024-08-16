import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { IOrder, IOrderCreate } from './order.interface';
import { dbSchema } from '../../infra/db/schema';
import * as typia from 'typia';

@Injectable()
export class OrderRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(params: IOrderCreate, db = this.drizzle.db): Promise<IOrder> {
    const [order] = await db.insert(dbSchema.orders).values(params).returning();
    return typia.assert<IOrder>(order);
  }
}
