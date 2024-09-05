import { Controller, UseGuards } from '@nestjs/common';
import { PostCategoryService } from '@src/v1/post/category/post-category.service';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import {
  CreatePostCategoryDto,
  PostCategoryDto,
  PostCategoryQuery,
  UpdatePostCategoryDto,
  PostCategoryWithChildrenDto,
  PostCategoryWithChildrenQuery,
} from '@src/v1/post/category/post-category.dto';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import { Uuid } from '@src/shared/types/primitive';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { withDefaultPagination } from '@src/core/pagination';

@Controller('v1/post-category')
export class PostCategoryController {
  constructor(private readonly postCategoryService: PostCategoryService) {}

  /**
   * 게시판 카테고리 목록을 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * Query parameter 'withChildren' 속성을 설정해 하위 카테고리 목록을 조회할 수 있습니다.
   *
   * Query parameter 'withChildren' 속성을 명시하지 않으면 기본값은 false 입니다.
   *
   * Query parameter 'withChildren' 속성이 false 일때, 하위 카테고리 목록은 빈 배열로 반환됩니다.
   *
   * @tag post-category
   * @summary 게시판 카테고리 목록 조회 (public)
   */
  @TypedRoute.Get('/')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async getRootPostCategories(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query: PostCategoryQuery,
  ): Promise<PostCategoryWithChildrenDto[]> {
    if (query.withChildren) {
      return await this.postCategoryService.getRootPostCategoriesWithChildren(
        withDefaultPagination(query),
      );
    }

    return await this.postCategoryService.getRootPostCategories(
      withDefaultPagination(query),
    );
  }

  /**
   * 특정 게시판 카테고리를 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * Query parameter 'withChildren' 속성을 설정해 하위 카테고리 목록을 조회할 수 있습니다.
   *
   * Query parameter 'withChildren' 속성을 명시하지 않으면 기본값은 false 입니다.
   *
   * Query parameter 'withChildren' 속성이 false 일때, 하위 카테고리 목록은 빈 배열로 반환됩니다.
   *
   * @tag post-category
   * @summary 게시판 카테고리 목록 조회 (public)
   */
  @TypedRoute.Get('/:id')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async getPostCategory(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('id') id: Uuid,
    @TypedQuery() query?: PostCategoryWithChildrenQuery,
  ): Promise<PostCategoryWithChildrenDto | null> {
    if (query?.withChildren) {
      return await this.postCategoryService.findPostCategoryWithChildren({
        id,
      });
    }

    return await this.postCategoryService.findPostCategory({ id });
  }

  /**
   * 게시판 카테고리를 생성합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag post-category
   * @summary 게시판 카테고리 생성 - Role('admin', 'manager')
   */
  @TypedRoute.Post('/')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async createPostCategory(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreatePostCategoryDto,
  ): Promise<PostCategoryDto> {
    return await this.postCategoryService.createPostCategory(body);
  }

  /**
   * 게시판 카테고리를 수정합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag post-category
   * @summary 게시판 카테고리 수정 - Role('admin', 'manager')
   * @param id - 수정할 게시판 카테고리의 id
   */
  @TypedRoute.Patch('/:id')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'category not found',
  })
  async updatePostCategory(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('id') id: Uuid,
    @TypedBody() body: UpdatePostCategoryDto,
  ) {
    return await this.postCategoryService.updatePostCategory(
      {
        id,
      },
      body,
    );
  }

  /**
   * 게시판 카테고리를 삭제합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * Hard delete로 구현되어 있습니다.
   *
   * **삭제 대상 카테고리와 연관된 게시글과 하위 카테고리를 "모두" 삭제합니다.**
   *
   * @tag post-category
   * @summary 게시판 카테고리 삭제 - Role('admin', 'manager')
   * @param id - 삭제할 게시판 카테고리의 id
   */
  @TypedRoute.Delete('/:id')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'category not found',
  })
  async deletePostCategory(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('id') id: Uuid,
  ): Promise<void> {
    return await this.postCategoryService.deletePostCategory({ id });
  }
}
