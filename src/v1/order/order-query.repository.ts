import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { IOrder } from './order.interface';
import { eq } from 'drizzle-orm';
import { dbSchema } from '../../infra/db/schema';
import * as typia from 'typia';
import { DiscountValue, Price } from '../../shared/types/primitive';
import { ICourseOrderRelations } from './course/course-order.interface';
import { IProductSnapshotPricing } from '../product/common/snapshot/pricing/product-snapshot-pricing.interface';
import { IProductSnapshotDiscount } from '../product/common/snapshot/discount/product-snapshot-discount.interface';
import { IProductSnapshotContent } from '../product/common/snapshot/content/product-snapshot-content.interface';

@Injectable()
export class OrderQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findOne(
    where: Pick<IOrder, 'id'>,
  ): Promise<ICourseOrderRelations | null> {
    const order = await this.drizzle.db.query.orders.findFirst({
      where: eq(dbSchema.orders.id, where.id),
      with: {
        // Todo: Add ebook order
        courseOrder: {
          with: {
            productSnapshot: {
              with: {
                product: true,
                content: true,
                pricing: true,
                discounts: true,
              },
            },
          },
        },
      },
    });

    if (!order?.courseOrder?.productSnapshot) {
      return null;
    }

    return {
      ...order,
      amount: typia.assert<Price>(`${order.amount}`),
      productOrder: {
        ...order.courseOrder,
        productSnapshot: {
          ...order.courseOrder.productSnapshot,
          courseId: order.courseOrder.productSnapshot.product.courseId,
          content: typia.assert<IProductSnapshotContent>(
            order.courseOrder.productSnapshot.content,
          ),
          pricing: {
            ...typia.assert<Omit<IProductSnapshotPricing, 'amount'>>(
              order.courseOrder.productSnapshot.pricing,
            ),
            amount: typia.assert<Price>(
              `${order.courseOrder.productSnapshot.pricing!.amount}`,
            ),
          },
          discounts: typia.assert<IProductSnapshotDiscount | null>(
            order.courseOrder.productSnapshot.discounts
              ? ({
                  ...order.courseOrder.productSnapshot.discounts,
                  value: typia.assert<DiscountValue>(
                    `${order.courseOrder.productSnapshot.discounts.value}`,
                  ),
                } satisfies IProductSnapshotDiscount)
              : null,
          ),
        },
      },
    };
  }

  async findOneOrThrow(where: Pick<IOrder, 'id'>): Promise<IOrder> {
    const order = await this.findOne(where);

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    return order;
  }
}
