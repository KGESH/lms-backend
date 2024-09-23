import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ITerm, ITermWithSnapshot } from '@src/v1/term/term.interface';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';

@Injectable()
export class TermQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

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
