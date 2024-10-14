import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ITerm, ITermWithSnapshot } from '@src/v1/term/term.interface';
import { count, eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { Paginated, Pagination } from '@src/shared/types/pagination';

@Injectable()
export class TermQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findManyTermsWithLatestSnapshot(
    pagination: Pagination,
  ): Promise<Paginated<ITermWithSnapshot[]>> {
    const { termsWithLatestSnapshot, totalCount } =
      await this.drizzle.db.transaction(async (tx) => {
        const totalTermsCountQuery = tx
          .select({ totalCount: count() })
          .from(dbSchema.terms);

        const termsWithLatestSnapshotQuery = tx.query.terms.findMany({
          with: {
            snapshots: {
              orderBy: (snapshot, { desc }) => desc(snapshot.createdAt),
              limit: 1,
            },
          },
          orderBy: (term, { asc, desc }) =>
            pagination.orderBy === 'asc'
              ? asc(term.createdAt)
              : desc(term.createdAt),
          offset: (pagination.page - 1) * pagination.pageSize,
          limit: pagination.pageSize,
        });

        const [termsWithLatestSnapshot, [{ totalCount }]] = await Promise.all([
          termsWithLatestSnapshotQuery,
          totalTermsCountQuery,
        ]);

        return { termsWithLatestSnapshot, totalCount };
      });

    return {
      pagination,
      totalCount: totalCount ?? 0,
      data: termsWithLatestSnapshot.map((term) => ({
        ...term,
        snapshot: term.snapshots[0],
      })),
    };
  }

  async findTermWithLatestSnapshot(
    where: Pick<ITerm, 'id'>,
  ): Promise<ITermWithSnapshot | null> {
    const termWithLatestSnapshot = await this.drizzle.db.query.terms.findFirst({
      where: eq(dbSchema.terms.id, where.id),
      with: {
        snapshots: {
          orderBy: (snapshot, { desc }) => desc(snapshot.createdAt),
          limit: 1,
        },
      },
    });

    if (!termWithLatestSnapshot?.snapshots[0]) {
      return null;
    }

    return {
      ...termWithLatestSnapshot,
      snapshot: termWithLatestSnapshot.snapshots[0],
    };
  }
}
