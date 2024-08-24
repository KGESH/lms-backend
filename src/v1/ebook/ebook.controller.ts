import { Controller, Logger, UseGuards } from '@nestjs/common';
import { EbookService } from '@src/v1/ebook/ebook.service';
import { EbookQueryService } from '@src/v1/ebook/ebook-query.service';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import {
  EbookCreateDto,
  EbookDto,
  EbookQuery,
  EbookUpdateDto,
} from '@src/v1/ebook/ebook.dto';
import { DEFAULT_PAGINATION } from '@src/core/pagination.constant';
import { ebookToDto } from '@src/shared/helpers/transofrm/ebook';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { Uuid } from '@src/shared/types/primitive';

@Controller('v1/ebook')
export class EbookController {
  private readonly logger = new Logger(EbookController.name);

  constructor(
    private readonly ebookService: EbookService,
    private readonly ebookQueryService: EbookQueryService,
  ) {}

  /**
   * 전자책 목록을 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * 전자책 제목과 설명 정도의 간단한 정보만을 제공합니다.
   *
   * Query parameter 'categoryId' 속성을 설정해 해당 카테고리에 속하는 전자책 목록만 조회할 수도 있습니다.
   *
   * @tag ebook
   * @summary 전자책 목록 조회 (public)
   */
  @TypedRoute.Get('/')
  @SkipAuth()
  async getEbooks(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query?: EbookQuery,
  ): Promise<EbookDto[]> {
    const ebooks = await this.ebookQueryService.findEbooks({
      ...DEFAULT_PAGINATION,
      ...query,
    });

    return ebooks.map(ebookToDto);
  }

  /**
   * 특정 전자책 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * 전자책 제목과 설명 정도의 간단한 정보만을 제공합니다.
   *
   * @tag ebook
   * @summary 특정 전자책 조회 (public)
   * @param id - 조회할 전자책의 id
   */
  @TypedRoute.Get('/:id')
  @SkipAuth()
  async getEbook(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('id') id: Uuid,
  ): Promise<EbookDto | null> {
    const ebook = await this.ebookQueryService.findEbookWithRelations({ id });

    if (!ebook) {
      return null;
    }

    return ebookToDto(ebook);
  }

  /**
   * 전자책을 생성합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * 전자책 생성 이후 'ebook-content' (전자책 파일)등을 생성해야 합니다.
   *
   * @tag ebook
   * @summary 강의 생성 - Role('admin', 'manager', 'teacher')
   */
  @TypedRoute.Post('/')
  @Roles('admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'category or teacher not found',
  })
  async createEbook(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: EbookCreateDto,
  ): Promise<EbookDto> {
    const ebook = await this.ebookService.createEbook(body);
    return ebookToDto(ebook);
  }

  /**
   * 전자책을 수정합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * 카테고리, 전자책 제목, 전자책 설명을 수정할 수 있습니다.
   *
   * @tag ebook
   * @summary 전자책 수정 - Role('admin', 'manager', 'teacher')
   * @param id - 수정할 전자책의 id
   */
  @TypedRoute.Patch('/:id')
  @Roles('admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'category or teacher not found',
  })
  async updateEbook(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('id') id: Uuid,
    @TypedBody() body: EbookUpdateDto,
  ): Promise<EbookDto> {
    const ebook = await this.ebookService.updateEbook({ id }, body);
    return ebookToDto(ebook);
  }

  /**
   * 전자책를 삭제합니다. (미완성)
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * 현재 Hard delete로 구현되어 있습니다.
   *
   * Soft delete 구현 예정입니다.
   *
   * @tag ebook
   * @summary 전자책 삭제 - Role('admin', 'manager', 'teacher')
   * @deprecated
   * @param id - 삭제할 전자책의 id
   */
  @TypedRoute.Delete('/:id')
  @Roles('admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<404>>({
    status: 404,
    description: 'ebook not found',
  })
  async deleteEbook(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('id') id: Uuid,
  ) {
    const ebook = await this.ebookService.deleteEbook({ id });
    return ebookToDto(ebook);
  }
}
