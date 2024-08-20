import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../../infra/db/drizzle.service';
import {
  IProductSnapshot,
  IProductSnapshotCreate,
} from '../common/snapshot/conrse-product-snapshot.interface';
import { TransactionClient } from 'src/infra/db/drizzle.types';
import { eq } from 'drizzle-orm';
import { dbSchema } from '../../../infra/db/schema';
import { now } from '../../../shared/utils/date';

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
      .set({ deletedAt: now('date') })
      .where(eq(dbSchema.courseProductSnapshots.id, where.id))
      .returning();
    return deleted;
  }
}
