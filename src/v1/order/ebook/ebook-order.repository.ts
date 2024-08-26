import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IEbookOrder,
  IEbookOrderCreate,
} from '@src/v1/order/ebook/ebook-order.interface';

@Injectable()
export class EbookOrderRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findOne(where: Pick<IEbookOrder, 'id'>): Promise<IEbookOrder | null> {
    const ebookOrder = await this.drizzle.db.query.ebookOrders.findFirst({
      where: eq(dbSchema.ebookOrders.id, where.id),
    });

    if (!ebookOrder) {
      return null;
    }

    return ebookOrder;
  }

  async findOneOrThrow(where: Pick<IEbookOrder, 'id'>): Promise<IEbookOrder> {
    const order = await this.findOne(where);

    if (!order) {
      throw new NotFoundException(`EbookOrder not found`);
    }

    return order;
  }

  async create(
    params: IEbookOrderCreate,
    db = this.drizzle.db,
  ): Promise<IEbookOrder> {
    const [ebookOrder] = await db
      .insert(dbSchema.ebookOrders)
      .values(params)
      .returning();

    return ebookOrder;
  }
}
