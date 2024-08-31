import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IPostCategoryAccess,
  IPostCategoryAccessRoles,
} from '@src/v1/post/category/access/post-category-access.interface';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';

@Injectable()
export class PostCategoryAccessQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findPostCategoryAccesses(
    where: Pick<IPostCategoryAccess, 'categoryId'>,
  ): Promise<IPostCategoryAccessRoles> {
    const category = await this.drizzle.db.query.postCategories.findFirst({
      where: eq(dbSchema.postCategories.id, where.categoryId),
      with: {
        readAccesses: true,
        writeAccesses: true,
      },
    });

    if (!category) {
      throw new NotFoundException('PostCategory not found');
    }

    return {
      categoryId: where.categoryId,
      readableRoles: category.readAccesses.map(({ role }) => role),
      writableRoles: category.writeAccesses.map(({ role }) => role),
    };
  }
}
