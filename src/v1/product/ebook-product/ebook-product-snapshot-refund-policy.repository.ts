import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import {
  IProductSnapshotRefundPolicy,
  IProductSnapshotRefundPolicyCreate,
} from '@src/v1/product/common/snapshot/refund-policy/product-snapshot-refund-policy.interface';
import * as typia from 'typia';

@Injectable()
export class EbookProductSnapshotRefundPolicyRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: IProductSnapshotRefundPolicyCreate,
    db = this.drizzle.db,
  ): Promise<IProductSnapshotRefundPolicy> {
    const [ebookProductContent] = await db
      .insert(dbSchema.ebookProductSnapshotRefundPolicies)
      .values(typia.misc.clone(params))
      .returning();

    return ebookProductContent;
  }
}
