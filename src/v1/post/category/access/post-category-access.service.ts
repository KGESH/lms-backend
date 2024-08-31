import { Injectable, NotFoundException } from '@nestjs/common';
import { PostCategoryAccessRepository } from '@src/v1/post/category/access/post-category-access.repository';
import {
  IPostCategoryAccess,
  IPostCategoryAccessDelete,
  IPostCategoryAccessRoles,
} from '@src/v1/post/category/access/post-category-access.interface';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { PostCategoryAccessQueryRepository } from '@src/v1/post/category/access/post-category-access-query.repository';

@Injectable()
export class PostCategoryAccessService {
  constructor(
    private readonly postCategoryAccessRepository: PostCategoryAccessRepository,
    private readonly postCategoryAccessQueryRepository: PostCategoryAccessQueryRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async createPostCategoryAccesses(
    params: IPostCategoryAccessRoles,
  ): Promise<IPostCategoryAccessRoles> {
    const createReadAccessParams = params.readableRoles.map((role) => ({
      categoryId: params.categoryId,
      role,
    }));
    const createWriteAccessParams = params.writableRoles.map((role) => ({
      categoryId: params.categoryId,
      role,
    }));

    return await this.drizzle.db.transaction(async (tx) => {
      const readableAccesses =
        await this.postCategoryAccessRepository.createPostCategoryReadAccesses(
          createReadAccessParams,
          tx,
        );
      const writableAccesses =
        await this.postCategoryAccessRepository.createPostCategoryWriteAccesses(
          createWriteAccessParams,
          tx,
        );

      return {
        categoryId: params.categoryId,
        readableRoles: readableAccesses.map((access) => access.role),
        writableRoles: writableAccesses.map((access) => access.role),
      } satisfies IPostCategoryAccessRoles;
    });
  }

  async deletePostCategoryAccesses(
    params: IPostCategoryAccessRoles,
  ): Promise<void> {
    const exist =
      await this.postCategoryAccessQueryRepository.findPostCategoryAccesses({
        categoryId: params.categoryId,
      });

    const checkEveryItemExists = (arr: unknown[], target: unknown[]) =>
      target.every((v) => arr.includes(v));

    if (
      !checkEveryItemExists(exist.readableRoles, params.readableRoles) ||
      !checkEveryItemExists(exist.writableRoles, params.writableRoles)
    ) {
      throw new NotFoundException('Some delete target roles are not found.');
    }

    const { deletedReadAccess, deletedWriteAccess } =
      await this.drizzle.db.transaction(async (tx) => {
        const deletedReadAccess =
          await this.postCategoryAccessRepository.deletePostCategoryReadAccesses(
            {
              categoryId: params.categoryId,
            },
            params.readableRoles.map((role) => ({ role })),
          );
        const deletedWriteAccess =
          await this.postCategoryAccessRepository.deletePostCategoryWriteAccesses(
            {
              categoryId: params.categoryId,
            },
            params.writableRoles.map((role) => ({ role })),
          );

        return {
          deletedReadAccess,
          deletedWriteAccess,
        };
      });
    console.log({ deletedReadAccess, deletedWriteAccess });
  }
}
