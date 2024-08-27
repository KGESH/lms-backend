import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IReviewReplySnapshot,
  IReviewReplySnapshotCreate,
} from '@src/v1/review/review.interface';
import { dbSchema } from '@src/infra/db/schema';
import * as typia from 'typia';

@Injectable()
export class ReviewReplySnapshotRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createReplySnapshot(
    params: IReviewReplySnapshotCreate,
    db = this.drizzle.db,
  ): Promise<IReviewReplySnapshot> {
    const [replySnapshot] = await db
      .insert(dbSchema.reviewReplySnapshots)
      .values(typia.misc.clone(params))
      .returning();

    return replySnapshot;
  }
}
