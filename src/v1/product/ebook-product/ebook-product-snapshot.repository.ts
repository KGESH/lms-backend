import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import {
  IProductSnapshot,
  IProductSnapshotCreate,
} from '@src/v1/product/common/snapshot/product-snapshot.interface';
import * as date from '@src/shared/utils/date';
import * as typia from 'typia';

@Injectable()
export class EbookProductSnapshotRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: IProductSnapshotCreate,
    db = this.drizzle.db,
  ): Promise<IProductSnapshot> {
    const [snapshot] = await db
      .insert(dbSchema.ebookProductSnapshots)
      .values(typia.misc.clone(params))
      .returning();
    return snapshot;
  }

  // Soft delete
  async softDelete(
    where: Pick<IProductSnapshot, 'id'>,
    db: TransactionClient,
  ): Promise<IProductSnapshot> {
    const [deleted] = await db
      .update(dbSchema.ebookProductSnapshots)
      .set({ deletedAt: date.now('date') })
      .where(eq(dbSchema.ebookProductSnapshots.id, where.id))
      .returning();
    return deleted;
  }

  async softDeleteThumbnailFile(
    where: Pick<IProductSnapshot, 'thumbnailId'>,
    db = this.drizzle.db,
  ): Promise<void> {
    await db
      .update(dbSchema.files)
      .set({ deletedAt: date.now('date') })
      .where(eq(dbSchema.files.id, where.thumbnailId));
  }
}
