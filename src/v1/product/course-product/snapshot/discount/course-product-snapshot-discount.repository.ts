import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../../../../infra/db/drizzle.service';
import { dbSchema } from '../../../../../infra/db/schema';
import * as typia from 'typia';
import {
  ICourseProductSnapshotDiscount,
  ICourseProductSnapshotDiscountCreate,
} from './course-product-snapshot-discount.interface';
import { DiscountValue } from '../../../../../shared/types/primitive';

@Injectable()
export class CourseProductSnapshotDiscountRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: ICourseProductSnapshotDiscountCreate,
    db = this.drizzle.db,
  ): Promise<ICourseProductSnapshotDiscount> {
    const [discount] = await db
      .insert(dbSchema.courseProductSnapshotDiscounts)
      .values(params)
      .returning();

    return {
      ...discount,
      value: typia.assert<DiscountValue>(`${discount.value}`),
    };
  }
}
