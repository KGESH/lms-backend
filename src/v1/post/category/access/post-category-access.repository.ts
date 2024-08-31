import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IPostCategoryAccess,
  IPostCategoryAccessCreate,
  IPostCategoryAccessDelete,
} from '@src/v1/post/category/access/post-category-access.interface';
import { dbSchema } from '@src/infra/db/schema';
import { and, eq, inArray } from 'drizzle-orm';

@Injectable()
export class PostCategoryAccessRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createPostCategoryReadAccesses(
    params: IPostCategoryAccessCreate[],
    db = this.drizzle.db,
  ) {
    const accesses = await db
      .insert(dbSchema.postCategoryReadAccesses)
      .values(params)
      .returning();

    return accesses;
  }

  async deletePostCategoryReadAccesses(
    where: Pick<IPostCategoryAccess, 'categoryId'>,
    params: IPostCategoryAccessDelete[],
    db = this.drizzle.db,
  ): Promise<IPostCategoryAccess[]> {
    const deleted = await db
      .delete(dbSchema.postCategoryReadAccesses)
      .where(
        and(
          eq(dbSchema.postCategoryReadAccesses.categoryId, where.categoryId),
          inArray(
            dbSchema.postCategoryReadAccesses.role,
            params.map(({ role }) => role),
          ),
        ),
      )
      .returning();

    return deleted;
  }

  async createPostCategoryWriteAccesses(
    params: IPostCategoryAccessCreate[],
    db = this.drizzle.db,
  ) {
    const accesses = await db
      .insert(dbSchema.postCategoryWriteAccesses)
      .values(params)
      .returning();

    return accesses;
  }

  async deletePostCategoryWriteAccesses(
    where: Pick<IPostCategoryAccess, 'categoryId'>,
    params: IPostCategoryAccessDelete[],
    db = this.drizzle.db,
  ): Promise<IPostCategoryAccess[]> {
    const deleted = await db
      .delete(dbSchema.postCategoryWriteAccesses)
      .where(
        and(
          eq(dbSchema.postCategoryWriteAccesses.categoryId, where.categoryId),
          inArray(
            dbSchema.postCategoryWriteAccesses.role,
            params.map(({ role }) => role),
          ),
        ),
      )
      .returning();

    return deleted;
  }
}
