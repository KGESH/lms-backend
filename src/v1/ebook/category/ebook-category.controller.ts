import { Controller, Logger, UseGuards } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import { TypeGuardError } from 'typia';
import {
  EbookCategoryDto,
  EbookCategoryQuery,
  EbookCategoryWithChildrenDto,
  EbookCategoryWithChildrenQuery,
  CreateEbookCategoryDto,
  UpdateEbookCategoryDto,
} from '@src/v1/ebook/category/ebook-category.dto';
import { Uuid } from '@src/shared/types/primitive';
import { IErrorResponse } from '@src/shared/types/response';
import { DEFAULT_PAGINATION } from '@src/core/pagination.constant';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { Roles } from '@src/core/decorators/roles.decorator';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import { EbookCategoryService } from '@src/v1/ebook/category/ebook-category.service';
import { withDefaultPagination } from '@src/core/pagination';

@Controller('v1/ebook/category')
export class EbookCategoryController {
  private readonly logger = new Logger(EbookCategoryController.name);

  constructor(private readonly ebookCategoryService: EbookCategoryService) {}

  /**
   * 전자책 카테고리 목록을 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * Query parameter 'withChildren' 속성을 설정해 하위 카테고리 목록을 조회할 수 있습니다.
   *
   * Query parameter 'withChildren' 속성을 명시하지 않으면 기본값은 false 입니다.
   *
   * Query parameter 'withChildren' 속성이 false 일때, 하위 카테고리 목록은 빈 배열로 반환됩니다.
   *
   * @tag ebook-category
   * @summary 전자책 카테고리 목록 조회 (public)
   */
  @TypedRoute.Get('/')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async getRootEbookCategories(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query: EbookCategoryQuery,
  ): Promise<EbookCategoryWithChildrenDto[]> {
    this.logger.verbose('[GET v1/ebook/category]');
    if (query.withChildren) {
      const rootsWithChildren =
        await this.ebookCategoryService.getRootCategoriesWithChildren(
          withDefaultPagination(query),
        );
      return rootsWithChildren;
    }

    const roots = await this.ebookCategoryService.getRootCategories(
      withDefaultPagination(query),
    );
    return roots;
  }

  /**
   * 특정 전자책 카테고리를 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * Query parameter 'withChildren' 속성을 설정해 하위 카테고리 목록을 조회할 수 있습니다.
   *
   * Query parameter 'withChildren' 속성을 명시하지 않으면 기본값은 false 입니다.
   *
   * Query parameter 'withChildren' 속성이 false 일때, 하위 카테고리 목록은 빈 배열로 반환됩니다.
   *
   * @tag ebook-category
   * @summary 전자책 카테고리 목록 조회 (public)
   */
  @TypedRoute.Get('/:id')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async getEbookCategory(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('id') id: Uuid,
    @TypedQuery() query?: EbookCategoryWithChildrenQuery,
  ): Promise<EbookCategoryWithChildrenDto | null> {
    this.logger.verbose('[GET v1/ebook/category/:id]');
    if (query?.withChildren) {
      const categoryWithChildren =
        await this.ebookCategoryService.findEbookCategoryWithChildren({ id });
      return categoryWithChildren;
    }

    const category = await this.ebookCategoryService.findEbookCategory({ id });
    return category;
  }

  /**
   * 전자책 카테고리를 생성합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag ebook-category
   * @summary 전자책 카테고리 생성 - Role('admin', 'manager')
   */
  @TypedRoute.Post('/')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  async createEbookCategory(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CreateEbookCategoryDto,
  ): Promise<EbookCategoryDto> {
    const category = await this.ebookCategoryService.createEbookCategory(body);
    return category;
  }

  /**
   * 전자책 카테고리를 수정합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag ebook-category
   * @summary 전자책 카테고리 수정 - Role('admin', 'manager')
   * @param id - 수정할 전자책 카테고리의 id
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
  async updateEbookCategory(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('id') id: Uuid,
    @TypedBody() body: UpdateEbookCategoryDto,
  ): Promise<EbookCategoryDto> {
    const category = await this.ebookCategoryService.updateEbookCategory(
      { id },
      body,
    );
    return category;
  }

  /**
   * 전자책 카테고리를 삭제합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * Hard delete로 구현되어 있습니다.
   *
   * 삭제 대상 카테고리와 연관된 전자책이 존재하면 403 예외를 반환합니다.
   *
   * 삭제 대상 카테고리와 연관된 전자책을 먼저 삭제해야 합니다.
   *
   * @tag ebook-category
   * @summary 전자책 카테고리 삭제 - Role('admin', 'manager')
   * @param id - 삭제할 전자책 카테고리의 id
   */
  @TypedRoute.Delete('/:id')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'category has ebooks',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'category not found',
  })
  async deleteEbookCategory(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('id') id: Uuid,
  ): Promise<EbookCategoryDto> {
    const category = await this.ebookCategoryService.deleteEbookCategory({
      id,
    });
    return category;
  }
}
