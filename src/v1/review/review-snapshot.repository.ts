import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { IReviewSnapshot, IReviewSnapshotCreate } from './review.interface';
import { dbSchema } from '../../infra/db/schema';

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
