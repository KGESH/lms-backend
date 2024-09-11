import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PostCategoryAccessRepository } from '@src/v1/post/category/access/post-category-access.repository';
import { IPostCategoryAccessRoles } from '@src/v1/post/category/access/post-category-access.interface';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { PostCategoryAccessQueryRepository } from '@src/v1/post/category/access/post-category-access-query.repository';
import { UNIQUE_CONSTRAINT_ERROR_CODE } from '@src/infra/db/db.constant';

@Injectable()
export class PostCategoryAccessService {
  private readonly logger = new Logger(PostCategoryAccessService.name);
  constructor(
    private readonly postCategoryAccessRepository: PostCategoryAccessRepository,
    private readonly postCategoryAccessQueryRepository: PostCategoryAccessQueryRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async createPostCategoryAccesses(
    params: IPostCategoryAccessRoles,
  ): Promise<IPostCategoryAccessRoles> {
    this._validateCreateParamsOrThrow(params);

    const createReadAccessParams = params.readableRoles.map((role) => ({
      categoryId: params.categoryId,
      role,
    }));
    const createWriteAccessParams = params.writableRoles.map((role) => ({
      categoryId: params.categoryId,
      role,
    }));

    const accesses = await this.drizzle.db
      .transaction(async (tx) => {
        const readableAccesses =
          createReadAccessParams.length > 0
            ? await this.postCategoryAccessRepository.createPostCategoryReadAccesses(
                createReadAccessParams,
                tx,
              )
            : [];
        const writableAccesses =
          createWriteAccessParams.length > 0
            ? await this.postCategoryAccessRepository.createPostCategoryWriteAccesses(
                createWriteAccessParams,
                tx,
              )
            : [];

        return {
          categoryId: params.categoryId,
          readableRoles: readableAccesses.map((access) => access.role),
          writableRoles: writableAccesses.map((access) => access.role),
        } satisfies IPostCategoryAccessRoles;
      })
      .catch((e) => {
        this.logger.error(`[Create post category access]`, e);
        if (e.code === UNIQUE_CONSTRAINT_ERROR_CODE) {
          throw new ConflictException(
            `[Category ID, Role] pair already exists.`,
          );
        }

        throw e;
      });

    return accesses;
  }

  _validateCreateParamsOrThrow({
    readableRoles,
    writableRoles,
  }: Pick<IPostCategoryAccessRoles, 'readableRoles' | 'writableRoles'>) {
    if (writableRoles.includes('guest') && writableRoles.length > 1) {
      throw new ForbiddenException(
        'If guest role is included in writable roles, another role should not be included.',
      );
    }

    if (readableRoles.includes('guest') && readableRoles.length > 1) {
      throw new ForbiddenException(
        'If guest role is included in readable roles, another role should not be included.',
      );
    }
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
          params.readableRoles.length > 0
            ? await this.postCategoryAccessRepository.deletePostCategoryReadAccesses(
                {
                  categoryId: params.categoryId,
                },
                params.readableRoles.map((role) => ({ role })),
                tx,
              )
            : [];
        const deletedWriteAccess =
          params.writableRoles.length > 0
            ? await this.postCategoryAccessRepository.deletePostCategoryWriteAccesses(
                {
                  categoryId: params.categoryId,
                },
                params.writableRoles.map((role) => ({ role })),
                tx,
              )
            : [];

        return {
          deletedReadAccess,
          deletedWriteAccess,
        };
      });

    this.logger.log('Deleted post category access', {
      deletedReadAccess,
      deletedWriteAccess,
    });
  }
}
