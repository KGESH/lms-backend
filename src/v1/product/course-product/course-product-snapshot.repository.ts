import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import {
  IProductSnapshot,
  IProductSnapshotCreate,
} from '@src/v1/product/common/snapshot/conrse-product-snapshot.interface';
import * as date from '@src/shared/utils/date';

@Injectable()
export class CourseProductSnapshotRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: IProductSnapshotCreate,
    db = this.drizzle.db,
  ): Promise<IProductSnapshot> {
    const [snapshot] = await db
      .insert(dbSchema.courseProductSnapshots)
      .values(params)
      .returning();
    return snapshot;
  }

  // Soft delete
  async delete(
    where: Pick<IProductSnapshot, 'id'>,
    db: TransactionClient,
  ): Promise<IProductSnapshot> {
    const [deleted] = await db
      .update(dbSchema.courseProductSnapshots)
      .set({ deletedAt: date.now('date') })
      .where(eq(dbSchema.courseProductSnapshots.id, where.id))
      .returning();
    return deleted;
  }
}
