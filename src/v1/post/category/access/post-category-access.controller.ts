import { Controller, UseGuards } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
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
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';

@Controller('v1/post-category/:categoryId/access')
export class PostCategoryAccessController {
  constructor(
    private readonly postCategoryAccessService: PostCategoryAccessService,
  ) {}

  /**
   * 게시판 카테고리 권한을 생성합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag post-category
   * @summary 게시판 카테고리 권한 생성 - Role('admin', 'manager')
   */
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description:
      'If [guest] role is included in roles, another role should not be included.',
  })
  @TypedException<IErrorResponse<409>>({
    status: 409,
    description: '[Category ID, Role] pair already exists.',
  })
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
