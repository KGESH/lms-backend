import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  ITermSnapshot,
  ITermSnapshotCreate,
} from '@src/v1/term/term.interface';
import { dbSchema } from '@src/infra/db/schema';

@Injectable()
export class TermSnapshotRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createTermSnapshot(
    params: ITermSnapshotCreate,
    db = this.drizzle.db,
  ): Promise<ITermSnapshot> {
    const [termSnapshot] = await db
      .insert(dbSchema.termSnapshots)
      .values(params)
      .returning();
    return termSnapshot;
  }
}
