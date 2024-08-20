import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { dbSchema } from '../../infra/db/schema';
import * as typia from 'typia';
import { IOrderRefund, IOrderRefundCreate } from './order-refund.interface';

@Injectable()
export class OrderRefundRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: IOrderRefundCreate,
    db = this.drizzle.db,
  ): Promise<IOrderRefund> {
    const [orderRefund] = await db
      .insert(dbSchema.orderRefunds)
      .values(params)
      .returning();

    return typia.assert<IOrderRefund>(orderRefund);
  }
}
