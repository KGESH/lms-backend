import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IPostCommentSnapshot,
  IPostCommentSnapshotCreate,
} from '@src/v1/post/comment/post-comment-snapshot.interface';
import { dbSchema } from '@src/infra/db/schema';

@Injectable()
export class PostCommentSnapshotRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createPostCommentSnapshot(
    params: IPostCommentSnapshotCreate,
    db = this.drizzle.db,
  ): Promise<IPostCommentSnapshot> {
    const [postCommentSnapshot] = await db
      .insert(dbSchema.postCommentSnapshots)
      .values(params)
      .returning();

    return postCommentSnapshot;
  }
}
