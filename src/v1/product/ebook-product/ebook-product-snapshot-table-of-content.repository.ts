import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import * as typia from 'typia';
import {
  IEbookProductSnapshotTableOfContent,
  IEbookProductSnapshotTableOfContentCreate,
} from '@src/v1/product/ebook-product/snapshot/content/product-snapshot-content.interface';

@Injectable()
export class EbookProductSnapshotTableOfContentRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: IEbookProductSnapshotTableOfContentCreate,
    db = this.drizzle.db,
  ): Promise<IEbookProductSnapshotTableOfContent> {
    const [ebookProductContent] = await db
      .insert(dbSchema.ebookProductSnapshotTableOfContents)
      .values(typia.misc.clone(params))
      .returning();

    return ebookProductContent;
  }
}
