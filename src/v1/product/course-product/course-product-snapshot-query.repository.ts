import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../../../infra/db/drizzle.service';
import { IProductSnapshot } from '../common/snapshot/conrse-product-snapshot.interface';
import { Pagination } from 'src/shared/types/pagination';
import { eq } from 'drizzle-orm';
import { dbSchema } from '../../../infra/db/schema';

@Injectable()
export class CourseProductSnapshotQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findOne(
    where: Pick<IProductSnapshot, 'id'>,
  ): Promise<IProductSnapshot | null> {
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
    where: Pick<IProductSnapshot, 'id'>,
  ): Promise<IProductSnapshot> {
    const snapshot = await this.findOne(where);

    if (!snapshot) {
      throw new NotFoundException('Snapshot not found');
    }

    return snapshot;
  }

  async findMany(pagination: Pagination): Promise<IProductSnapshot[]> {
    const snapshots =
      await this.drizzle.db.query.courseProductSnapshots.findMany({
        orderBy: (courseProductSnapshots, { desc }) =>
          desc(courseProductSnapshots.createdAt),
        limit: pagination.pageSize,
        offset: (pagination.page - 1) * pagination.pageSize,
      });
    return snapshots;
  }
}
