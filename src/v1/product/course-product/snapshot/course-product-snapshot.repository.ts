import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../../../../infra/db/drizzle.service';
import { IRepository } from '../../../../core/base.repository';
import {
  ICourseProductSnapshot,
  ICourseProductSnapshotCreate,
} from '../conrse-product-snapshot.interface';
import { TransactionClient } from 'src/infra/db/drizzle.types';
import { IPagination } from 'src/shared/types/pagination';
import { asc, desc, eq } from 'drizzle-orm';
import { dbSchema } from '../../../../infra/db/schema';
import { now } from '../../../../shared/utils/date';

@Injectable()
export class CourseProductSnapshotRepository
  implements IRepository<ICourseProductSnapshot>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async findOne(
    where: Pick<ICourseProductSnapshot, 'id'>,
  ): Promise<ICourseProductSnapshot | null> {
    const snapshot =
      await this.drizzle.db.query.courseProductSnapshots.findFirst({
        where: eq(dbSchema.courseProductSnapshots.id, where.id),
      });

    if (!snapshot) {
      return null;
    }

    return snapshot;
  }

  async findOneOrThrow(
    where: Pick<ICourseProductSnapshot, 'id'>,
  ): Promise<ICourseProductSnapshot> {
    const snapshot = await this.findOne(where);

    if (!snapshot) {
      throw new NotFoundException('Snapshot not found');
    }

    return snapshot;
  }

  async findMany(pagination: IPagination): Promise<ICourseProductSnapshot[]> {
    const snapshots =
      await this.drizzle.db.query.courseProductSnapshots.findMany({
        where: pagination.cursor
          ? eq(dbSchema.courseProductSnapshots.id, pagination.cursor)
          : undefined,
        orderBy:
          pagination.orderBy === 'asc'
            ? asc(dbSchema.courseProductSnapshots.id)
            : desc(dbSchema.courseProductSnapshots.id),
        limit: pagination.pageSize,
      });
    return snapshots;
  }

  async create(
    params: ICourseProductSnapshotCreate,
    db = this.drizzle.db,
  ): Promise<ICourseProductSnapshot> {
    const [snapshot] = await db
      .insert(dbSchema.courseProductSnapshots)
      .values(params)
      .returning();
    return snapshot;
  }

  async update(
    where: Partial<ICourseProductSnapshot>,
    params: Partial<ICourseProductSnapshot>,
    db: TransactionClient,
  ): Promise<ICourseProductSnapshot> {
    throw new Error('Method not implemented.');
  }

  // Soft delete
  async delete(
    where: Pick<ICourseProductSnapshot, 'id'>,
    db: TransactionClient,
  ): Promise<ICourseProductSnapshot> {
    const [deleted] = await db
      .update(dbSchema.courseProductSnapshots)
      .set({ deletedAt: now('date') })
      .where(eq(dbSchema.courseProductSnapshots.id, where.id))
      .returning();
    return deleted;
  }
}
