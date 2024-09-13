import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import * as typia from 'typia';
import {
  IProductSnapshotUiContent,
  IProductSnapshotUiContentCreate,
} from '@src/v1/product/common/snapshot/ui-content/product-snapshot-ui-content.interface';

@Injectable()
export class EbookProductSnapshotUiContentRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createMany(
    params: IProductSnapshotUiContentCreate[],
    db = this.drizzle.db,
  ): Promise<IProductSnapshotUiContent[]> {
    const ebookProductUiContents = await db
      .insert(dbSchema.ebookProductSnapshotUiContents)
      .values(typia.misc.clone(params))
      .returning();

    return ebookProductUiContents;
  }
}
