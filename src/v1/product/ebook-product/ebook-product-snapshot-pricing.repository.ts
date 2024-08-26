import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { Price } from '@src/shared/types/primitive';
import { dbSchema } from '@src/infra/db/schema';
import * as typia from 'typia';
import {
  IProductSnapshotPricing,
  IProductSnapshotPricingCreate,
} from '@src/v1/product/common/snapshot/pricing/product-snapshot-pricing.interface';

@Injectable()
export class EbookProductSnapshotPricingRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: IProductSnapshotPricingCreate,
    db = this.drizzle.db,
  ): Promise<IProductSnapshotPricing> {
    const [pricing] = await db
      .insert(dbSchema.ebookProductSnapshotPricing)
      .values(typia.misc.clone(params))
      .returning();

    return {
      ...pricing,
      amount: typia.assert<Price>(`${pricing.amount}`),
    };
  }
}
