import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IReviewReply,
  IReviewReplyCreate,
} from '@src/v1/review/review.interface';
import { dbSchema } from '@src/infra/db/schema';
import * as date from '@src/shared/utils/date';
import * as typia from 'typia';
import { eq } from 'drizzle-orm';

@Injectable()
export class ReviewReplyRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createReply(
    params: IReviewReplyCreate,
    db = this.drizzle.db,
  ): Promise<IReviewReply> {
    const [reply] = await db
      .insert(dbSchema.reviewReplies)
      .values(typia.misc.clone(params))
      .returning();

    return reply;
  }

  // Soft delete
  async deleteReply(
    where: Pick<IReviewReply, 'id'>,
    db = this.drizzle.db,
  ): Promise<void> {
    await db
      .update(dbSchema.reviewReplies)
      .set({ deletedAt: date.now('date') })
      .where(eq(dbSchema.reviewReplies.id, where.id));
  }
}
