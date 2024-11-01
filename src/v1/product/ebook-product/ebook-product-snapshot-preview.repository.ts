import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import * as typia from 'typia';
import * as date from '@src/shared/utils/date';
import {
  IEbookProductSnapshotPreview,
  IEbookProductSnapshotPreviewCreate,
} from '@src/v1/product/ebook-product/snapshot/preview/ebook-product-snapshot-preview.interface';
import { eq } from 'drizzle-orm';

@Injectable()
export class EbookProductSnapshotPreviewRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: IEbookProductSnapshotPreviewCreate,
    db = this.drizzle.db,
  ): Promise<IEbookProductSnapshotPreview> {
    const [ebookProductContent] = await db
      .insert(dbSchema.ebookProductSnapshotPreviews)
      .values(typia.misc.clone(params))
      .returning();

    return ebookProductContent;
  }

  async softDeletePreviewFile(
    where: Pick<IEbookProductSnapshotPreview, 'fileId'>,
    db = this.drizzle.db,
  ): Promise<void> {
    await db
      .update(dbSchema.files)
      .set({ deletedAt: date.now('date') })
      .where(eq(dbSchema.files.id, where.fileId));
  }
}
