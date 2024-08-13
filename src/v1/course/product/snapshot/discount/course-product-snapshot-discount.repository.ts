import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../../../../infra/db/drizzle.service';
import { dbSchema } from '../../../../../infra/db/schema';
import * as typia from 'typia';
import {
  ICourseProductSnapshotDiscount,
  ICourseProductSnapshotDiscountCreate,
} from './course-product-snapshot-discount.interface';
import * as date from '../../../../../shared/utils/date';

@Injectable()
export class CourseProductSnapshotDiscountRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: ICourseProductSnapshotDiscountCreate,
    db = this.drizzle.db,
  ): Promise<ICourseProductSnapshotDiscount> {
    const [discount] = await db
      .insert(dbSchema.courseProductSnapshotDiscounts)
      .values({
        ...params,
        // validFrom: params.validFrom ? date.toDate(params.validFrom) : null,
        // validTo: params.validTo ? date.toDate(params.validTo) : null,
      })
      .returning();

    return typia.assert<ICourseProductSnapshotDiscount>({
      ...discount,
      // validFrom: discount.validFrom
      //   ? date.toISOString(discount.validFrom)
      //   : null,
      // validTo: discount.validTo ? date.toISOString(discount.validTo) : null,
    });
  }
}
