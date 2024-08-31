import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import {
  IPostSnapshot,
  IPostSnapshotCreate,
} from '@src/v1/post/post-snapshot.interface';
import * as typia from 'typia';

@Injectable()
export class PostSnapshotRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createPostSnapshot(
    params: IPostSnapshotCreate,
    db = this.drizzle.db,
  ): Promise<IPostSnapshot> {
    const [post] = await db
      .insert(dbSchema.postSnapshots)
      .values(typia.misc.clone(params))
      .returning();
    return post;
  }
}
