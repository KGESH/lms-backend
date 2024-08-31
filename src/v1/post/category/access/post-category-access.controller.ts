import { Controller, UseGuards } from '@nestjs/common';
import { TypedBody, TypedHeaders, TypedParam, TypedRoute } from '@nestia/core';
import { Uuid } from '@src/shared/types/primitive';
import { PostCategoryAccessService } from '@src/v1/post/category/access/post-category-access.service';
import {
  CreatePostCategoryAccessDto,
  DeletePostCategoryAccessDto,
  PostCategoryAccessRolesDto,
} from '@src/v1/post/category/access/post-category-access.dto';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { AuthHeaders } from '@src/v1/auth/auth.headers';

@Controller('v1/post-category/:categoryId/access')
export class PostCategoryAccessController {
  constructor(
    private readonly postCategoryAccessService: PostCategoryAccessService,
  ) {}

  @TypedRoute.Post('/')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  async createPostCategoryAccesses(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('categoryId') categoryId: Uuid,
    @TypedBody() body: CreatePostCategoryAccessDto,
  ): Promise<PostCategoryAccessRolesDto> {
    return await this.postCategoryAccessService.createPostCategoryAccesses({
      categoryId,
      ...body,
    });
  }

  @TypedRoute.Delete('/')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  async deletePostCategoryAccesses(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('categoryId') categoryId: Uuid,
    @TypedBody() body: DeletePostCategoryAccessDto,
  ): Promise<void> {
    return await this.postCategoryAccessService.deletePostCategoryAccesses({
      categoryId,
      ...body,
    });
  }
}
