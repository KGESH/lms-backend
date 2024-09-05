import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PostCategoryAccessQueryService } from '@src/v1/post/category/access/post-category-access-query.service';
import { PostQueryService } from '@src/v1/post/post-query.service';
import { Request } from 'express';
import * as typia from 'typia';
import { ISessionWithUser } from '@src/v1/auth/session.interface';
import { Uuid } from '@src/shared/types/primitive';
import { IPostCategoryAccessRoles } from '@src/v1/post/category/access/post-category-access.interface';

@Injectable()
export class PostCategoryAccessGuard implements CanActivate {
  private readonly logger = new Logger(PostCategoryAccessGuard.name);

  constructor(
    private readonly postQueryService: PostQueryService,
    private readonly postCategoryAccessQueryService: PostCategoryAccessQueryService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { action, categoryIds } = await this._getCategoryAccess(req);
    const accesses = await Promise.all(
      categoryIds.map((categoryId) =>
        this.postCategoryAccessQueryService.findPostCategoryAccesses({
          categoryId,
        }),
      ),
    );

    const session: ISessionWithUser | null = req['user']
      ? typia.assert<ISessionWithUser>(req['user'])
      : null;

    this._validatePermissionOrThrow(session, accesses, action);

    // If all checks pass, return true to allow access
    return true;
  }

  private async _getCategoryAccess(req: Request): Promise<{
    action: 'read' | 'write';
    categoryIds: Uuid[];
  }> {
    const method = req.method as 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

    switch (method) {
      case 'GET':
        // GET POSTS '/?categoryId=${QUERY}'
        if (req.query['categoryId']) {
          return {
            action: 'read',
            categoryIds: [req.query['categoryId'] as Uuid],
          };
        }

        // GET POST '/:id'
        const post = await this.postQueryService.findPost({
          id: req.params['id'],
        });

        // Hack. If post is not found, controller will return null.
        return {
          action: 'read',
          categoryIds: post?.categoryId ? [post.categoryId] : [],
        };

      case 'POST':
        return {
          action: 'write',
          categoryIds: [typia.assert<Uuid>(req.body['categoryId'])],
        };

      case 'PATCH':
        const existPost = await this.postQueryService.findPostOrThrow({
          id: req.params['id'],
        });
        const updateCategoryId: string | undefined = req.body['categoryId'];
        const categoryIds = [existPost.categoryId];
        if (updateCategoryId) categoryIds.push(updateCategoryId);
        return {
          action: 'write',
          categoryIds,
        };

      case 'DELETE':
        const deleteTargetPost = await this.postQueryService.findPostOrThrow({
          id: req.params['id'],
        });
        return {
          action: 'write',
          categoryIds: [deleteTargetPost.categoryId],
        };

      case 'PUT':
      default:
        throw new Error('Method not implemented.');
    }
  }

  private _validatePermissionOrThrow(
    session: ISessionWithUser | null,
    accesses: IPostCategoryAccessRoles[],
    action: 'read' | 'write',
  ) {
    const role = session?.user.role;

    for (const access of accesses) {
      const { categoryId, readableRoles, writableRoles } = access;

      if (readableRoles.length === 0 || writableRoles.length === 0) {
        throw new InternalServerErrorException(
          `You are not set to post category access roles. [CategoryID] ${categoryId}`,
        );
      }

      if (action === 'read') {
        if (readableRoles.includes('guest')) {
          continue;
        }

        if (role && readableRoles.includes(role)) {
          continue;
        }

        throw new ForbiddenException(
          `You are not allowed to read access post category. [CategoryID] ${categoryId}`,
        );
      } else {
        if (writableRoles.includes('guest')) {
          continue;
        }

        if (role && writableRoles.includes(role)) {
          continue;
        }

        throw new ForbiddenException(
          `You are not allowed to write access post category. [CategoryID] ${categoryId}`,
        );
      }
    }
  }
}
