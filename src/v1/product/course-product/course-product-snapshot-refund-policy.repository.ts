import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../../infra/db/drizzle.service';
import { dbSchema } from '../../../infra/db/schema';
import {
  IProductSnapshotRefundPolicy,
  IProductSnapshotRefundPolicyCreate,
} from '../common/snapshot/refund-policy/product-snapshot-refund-policy.interface';

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
