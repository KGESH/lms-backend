import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../../../../infra/db/drizzle.service';
import {
  ICourseProductSnapshotPricing,
  ICourseProductSnapshotPricingCreate,
} from './course-product-snapshot-pricing.interface';
import { dbSchema } from '../../../../../infra/db/schema';
import * as typia from 'typia';
import { Price } from '../../../../../shared/types/primitive';

@Injectable()
export class CourseProductSnapshotPricingRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: ICourseProductSnapshotPricingCreate,
    db = this.drizzle.db,
  ): Promise<ICourseProductSnapshotPricing> {
    const [pricing] = await db
      .insert(dbSchema.courseProductSnapshotPricing)
      .values(params)
      .returning();

    return {
      ...pricing,
      amount: typia.assert<Price>(`${pricing.amount}`),
    };
  }
}
