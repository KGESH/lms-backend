import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import {
  IProductSnapshotRefundPolicy,
  IProductSnapshotRefundPolicyCreate,
} from '@src/v1/product/common/snapshot/refund-policy/product-snapshot-refund-policy.interface';

@Injectable()
export class CourseProductSnapshotRefundPolicyRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: IProductSnapshotRefundPolicyCreate,
    db = this.drizzle.db,
  ): Promise<IProductSnapshotRefundPolicy> {
    const [courseProductContent] = await db
      .insert(dbSchema.courseProductSnapshotContents)
      .values(params)
      .returning();

    return courseProductContent;
  }
}
