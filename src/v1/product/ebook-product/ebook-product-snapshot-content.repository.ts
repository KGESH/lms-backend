import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import {
  IProductSnapshotContent,
  IProductSnapshotContentCreate,
} from '@src/v1/product/common/snapshot/content/product-snapshot-content.interface';
import * as typia from 'typia';

@Injectable()
export class EbookProductSnapshotContentRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: IProductSnapshotContentCreate,
    db = this.drizzle.db,
  ): Promise<IProductSnapshotContent> {
    const [ebookProductContent] = await db
      .insert(dbSchema.ebookProductSnapshotContents)
      .values(typia.misc.clone(params))
      .returning();

    return ebookProductContent;
  }
}
