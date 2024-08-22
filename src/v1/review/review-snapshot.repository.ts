import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import {
  IReviewSnapshot,
  IReviewSnapshotCreate,
} from '@src/v1/review/review.interface';

@Injectable()
export class ReviewSnapshotRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: IReviewSnapshotCreate,
    db = this.drizzle.db,
  ): Promise<IReviewSnapshot> {
    const [snapshot] = await db
      .insert(dbSchema.reviewSnapshots)
      .values(params)
      .returning();

    return snapshot;
  }
}
