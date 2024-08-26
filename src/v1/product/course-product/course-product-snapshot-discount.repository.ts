import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import { DiscountValue } from '@src/shared/types/primitive';
import * as typia from 'typia';
import {
  IProductSnapshotDiscount,
  IProductSnapshotDiscountCreate,
} from '@src/v1/product/common/snapshot/discount/product-snapshot-discount.interface';

@Injectable()
export class CourseProductSnapshotDiscountRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: IProductSnapshotDiscountCreate,
    db = this.drizzle.db,
  ): Promise<IProductSnapshotDiscount> {
    const [discount] = await db
      .insert(dbSchema.courseProductSnapshotDiscounts)
      .values(typia.misc.clone(params))
      .returning();

    return {
      ...discount,
      value: typia.assert<DiscountValue>(`${discount.value}`),
    };
  }
}
