import { Controller, UseGuards } from '@nestjs/common';
import { EbookContentService } from '@src/v1/ebook/ebook-content/ebook-content.service';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { TypeGuardError } from 'typia';
import { IErrorResponse } from '@src/shared/types/response';
import { AuthHeaders } from '@src/v1/auth/auth.headers';
import { Uuid } from '@src/shared/types/primitive';
import {
  EbookContentCreateDto,
  EbookContentDto,
} from '@src/v1/ebook/ebook-content/ebook-content.dto';
import { ebookContentToDto } from '@src/shared/helpers/transofrm/ebook-content';
import { EbookAccessGuard } from '@src/core/guards/ebook-access.guard';
import { EbookContentQueryService } from '@src/v1/ebook/ebook-content/ebook-content-query.service';

@Controller('v1/ebook/:ebookId/content')
export class EbookContentController {
  constructor(
    private readonly ebookContentService: EbookContentService,
    private readonly ebookContentQueryService: EbookContentQueryService,
  ) {}

  /**
   * 전자책 컨텐츠 목록을 조회합니다.
   *
   * 세션 사용자 role이 'user'라면 해당 'ebook'을 구매한 사용자만 조회할 수 있습니다.
   *
   * 제목, 설명, 컨텐츠 타입, 컨텐츠 URL, 메타데이터, 표기 순서 정보를 제공합니다.
   *
   * @tag ebook-content
   * @summary 전자책 컨텐츠 목록 조회
   * @param ebookId - 전자책 id
   */
  @TypedRoute.Get('/')
  @UseGuards(EbookAccessGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'User is not enrolled in the ebook',
  })
  async getEbookContents(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('ebookId') ebookId: Uuid,
  ): Promise<EbookContentDto[]> {
    const ebookContents = await this.ebookContentQueryService.findEbookContents(
      { ebookId },
    );
    return ebookContents.map(ebookContentToDto);
  }

  /**
   * 특정 전자책 컨텐츠를 조회합니다.
   *
   * 세션 사용자 role이 'user'라면 해당 'course'를 구매한 사용자만 조회할 수 있습니다.
   *
   * 제목, 설명, 컨텐츠 타입, 컨텐츠 URL, 메타데이터, 표기 순서 정보를 제공합니다.
   *
   * @tag ebook-content
   * @summary 특정 전자책 컨텐츠 조회
   * @param ebookId - 전자책 id
   * @param id - 조회할 전자책 컨텐츠의 id
   */
  @TypedRoute.Get('/:id')
  @UseGuards(EbookAccessGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<403>>({
    status: 403,
    description: 'User is not enrolled in the ebook',
  })
  async getEbookContent(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('ebookId') ebookId: Uuid,
    @TypedParam('id') ebookContentId: Uuid,
  ): Promise<EbookContentDto | null> {
    const ebookContent =
      await this.ebookContentQueryService.findEbookContentById({
        id: ebookContentId,
      });

    if (!ebookContent) {
      return null;
    }

    return ebookContentToDto(ebookContent);
  }

  /**
   * 전자책 컨텐츠를 생성합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * 여러개의 컨텐츠를 한번에 생성할 수 있습니다. (body 배열 create params)
   *
   * @tag ebook-content
   * @summary 전자책 컨텐츠 생성 - Role('admin', 'manager', 'teacher')
   * @param ebookId - 전자책 id
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
    description: 'ebook not found',
  })
  async createEbookContents(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('ebookId') ebookId: Uuid,
    @TypedBody() body: EbookContentCreateDto[],
  ): Promise<EbookContentDto[]> {
    const ebookContents =
      await this.ebookContentService.createEbookContents(body);

    return ebookContents.map(ebookContentToDto);
  }

  /**
   * 전자책 컨텐츠를 수정합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * @tag ebook-content
   * @summary 전자책 컨텐츠 수정 - Role('admin', 'manager', 'teacher')
   * @param ebookId - 전자책 id
   * @param id - 수정할 전자책 컨텐츠의 id
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
    description: 'ebook content not found',
  })
  async updateEbookContent(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('ebookId') ebookId: Uuid,
    @TypedParam('id') id: Uuid,
    @TypedBody() body: EbookContentCreateDto,
  ): Promise<EbookContentDto> {
    const ebookContent = await this.ebookContentService.updateEbookContent(
      { id },
      body,
    );

    return ebookContentToDto(ebookContent);
  }

  /**
   * 전자책 컨텐츠를 삭제합니다.
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * Hard delete로 구현되어 있습니다.
   *
   * @tag ebook-content
   * @summary 전자책 컨텐츠 삭제 - Role('admin', 'manager', 'teacher')
   * @param ebookId - 전자책 id
   * @param id - 삭제할 전자책 컨텐츠의 id
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
    description: 'ebook content not found',
  })
  async deleteEbookContent(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('ebookId') ebookId: Uuid,
    @TypedParam('id') id: Uuid,
  ): Promise<EbookContentDto> {
    const ebookContent = await this.ebookContentService.deleteEbookContent({
      id,
    });
    return ebookContentToDto(ebookContent);
  }
}
