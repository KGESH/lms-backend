import { Injectable } from '@nestjs/common';
import * as typia from 'typia';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import {
  IOrderRefund,
  IOrderRefundCreate,
} from '@src/v1/order/order-refund.interface';

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
