import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import {
  IPostComment,
  IPostCommentCreate,
} from '@src/v1/post/comment/post-comment.interface';
import { eq } from 'drizzle-orm';
import * as date from '@src/shared/utils/date';

@Injectable()
export class PostCommentRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createPostComment(
    params: IPostCommentCreate,
    db = this.drizzle.db,
  ): Promise<IPostComment> {
    const [postComment] = await db
      .insert(dbSchema.postComments)
      .values(params)
      .returning();

    return postComment;
  }

  // Soft delete
  async deletePostComment(
    where: Pick<IPostComment, 'id'>,
    db = this.drizzle.db,
  ): Promise<void> {
    await db
      .update(dbSchema.postComments)
      .set({ deletedAt: date.now('date') })
      .where(eq(dbSchema.postComments.id, where.id));
  }
}
