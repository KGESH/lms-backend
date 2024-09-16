import { Controller, UseGuards } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from '@nestia/core';
import { EbookProductService } from '@src/v1/product/ebook-product/ebook-product.service';
import { Uuid } from '@src/shared/types/primitive';
import {
  CreateEbookProductDto,
  EbookProductDto,
  EbookProductQuery,
  PaginatedEbookProducts,
  UpdateEbookProductDto,
} from '@src/v1/product/ebook-product/ebook-product.dto';
import * as date from '@src/shared/utils/date';
import { TypeGuardError } from 'typia';
import {
  ebookProductToDto,
  ebookProductWithPricingToDto,
} from '@src/shared/helpers/transofrm/ebook-product';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { IErrorResponse } from '@src/shared/types/response';
import { INVALID_LMS_SECRET } from '@src/core/error-code.constant';
import { withDefaultPagination } from '@src/core/pagination';

@Controller('v1/product/ebook')
export class EbookProductController {
  constructor(private readonly ebookProductService: EbookProductService) {}

  /**
   * 전자책 상품 목록을 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * 현재 Query parameter 'orderBy' 속성은 최초 전자책 상품이 등록된 시간 기준입니다. (스냅샷 생성 시간이 아닙니다.)
   *
   * 예시) 'A' 전자책 상품, 'B' 전자책 상품 순서로 생성 되었다고 가정.
   *
   * 이후 'A' 전자책 상품이 업데이트 되었다고 가정. (새로운 'A' 스냅샷 생성)
   *
   * orderBy desc 설정후 조회시, [B, A] 순서로 조회됩니다.
   *
   * orderBy asc 설정후 조회시, [A, B] 순서로 조회됩니다.
   *
   * 추후 Query parameter 속성을 통해 특정 컬럼을 기준으로 정렬할 수 있도록 구현 예정입니다.
   *
   * title: 상품 제목.
   *
   * description: 상품 설명 (사용처 미확정).
   *
   * ebook: 전자책 정보.
   *
   * pricing: 상품 가격 정보.
   *
   * discount: 상품 할인 정보.
   *
   * @tag product-ebook
   * @summary 전자책 상품 목록 조회 (public)
   */
  @TypedRoute.Get('/')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async getEbookProducts(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedQuery() query: EbookProductQuery,
  ): Promise<PaginatedEbookProducts> {
    const { data: products, ...paginated } =
      await this.ebookProductService.findEbookProductsWithPricing(
        withDefaultPagination(query),
      );

    return {
      ...paginated,
      data: products.map(ebookProductWithPricingToDto),
    };
  }

  /**
   * 가장 최신의 전자책 상품 상세 페이지를 조회합니다.
   *
   * 로그인 없이 조회할 수 있습니다.
   *
   * title: 상품 제목.
   *
   * description: 상품 설명 (사용처 미확정).
   *
   * announcement: 상품 상세 페이지 공지사항 rich text content.
   *
   * content: 상품 상세 페이지 rich text content.
   *
   * uiContents: 상품 상세 페이지 UI 컨텐츠.
   *
   * refundPolicy: 상품 상세 페이지 환불 정책 rich text content.
   *
   * pricing: 상품 가격 정보.
   *
   * discount: 상품 할인 정보.
   *
   * @tag product-ebook
   * @summary 특정 전자책 상품 조회 (public)
   * @param ebookId - 전자책 ID
   */
  @TypedRoute.Get('/:ebookId')
  @SkipAuth()
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async getEbookProduct(
    @TypedHeaders() headers: ApiAuthHeaders,
    @TypedParam('ebookId') ebookId: Uuid,
  ): Promise<EbookProductDto | null> {
    const product =
      await this.ebookProductService.findEbookProductWithRelations({
        ebookId,
      });

    if (!product || !product.lastSnapshot) {
      return null;
    }

    return ebookProductToDto({
      ...product,
      lastSnapshot: product.lastSnapshot,
    });
  }

  /**
   * 전자책 상품 상세 페이지를 생성합니다. (스냅샷)
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * 사용자는 가장 최신의 스냅샷을 조회할 수 있습니다.
   *
   * title: 상품 제목.
   *
   * description: 상품 설명 (사용처 미확정).
   *
   * announcement: 상품 상세 페이지 공지사항 rich text content.
   *
   * content: 상품 상세 페이지 rich text content.
   *
   * uiContents: 상품 상세 페이지 UI 컨텐츠.
   *
   * refundPolicy: 상품 상세 페이지 환불 정책 rich text content.
   *
   * pricing: 상품 가격 정보.
   *
   * discount: 상품 할인 정보.
   *
   * @tag product-ebook
   * @summary 전자책 상품 생성 - Role('admin', 'manager')
   * @param ebookId - 전자책 ID
   */
  @TypedRoute.Post('/:ebookId')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async createProductEbook(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('ebookId') ebookId: Uuid,
    @TypedBody() body: CreateEbookProductDto,
  ): Promise<EbookProductDto> {
    const product = await this.ebookProductService.createEbookProduct({
      ebookProductCreateParams: {
        ebookId,
      },
      ebookProductSnapshotCreateParams: {
        title: body.title,
        description: body.description,
      },
      ebookProductSnapshotContentCreateParams: {
        richTextContent: body.content.richTextContent,
      },
      ebookProductSnapshotAnnouncementCreateParams: {
        richTextContent: body.announcement.richTextContent,
      },
      ebookProductSnapshotRefundPolicyCreateParams: {
        richTextContent: body.refundPolicy.richTextContent,
      },
      ebookProductSnapshotPricingCreateParams: {
        amount: body.pricing.amount,
      },
      ebookProductSnapshotDiscountCreateParams: {
        ...body.discount,
        validFrom: body.discount.validFrom
          ? date.toDate(body.discount.validFrom)
          : null,
        validTo: body.discount.validTo
          ? date.toDate(body.discount.validTo)
          : null,
      },
      ebookProductSnapshotUiContentCreateParams: body.uiContents,
    });

    return ebookProductToDto(product);
  }

  /**
   * 전자책 상품 상세 페이지를 수정합니다. (스냅샷)
   *
   * 관리자 세션 id를 헤더에 담아서 요청합니다.
   *
   * 사용자는 가장 최신의 스냅샷을 조회할 수 있습니다.
   *
   * 업데이트할 필드만 body에 담아서 요청합니다.
   *
   * body에 담기지 않은 필드는 이전 스냅샷의 값을 그대로 사용합니다.
   *
   * title: 상품 제목.
   *
   * description: 상품 설명 (사용처 미확정).
   *
   * announcement: 상품 상세 페이지 공지사항 rich text content.
   *
   * content: 상품 상세 페이지 rich text content.
   *
   * uiContents: 상품 상세 페이지 UI 컨텐츠.
   *
   * refundPolicy: 상품 상세 페이지 환불 정책 rich text content.
   *
   * pricing: 상품 가격 정보.
   *
   * discount: 상품 할인 정보.
   *
   * @tag product-ebook
   * @summary 전자책 상품 생성 - Role('admin', 'manager')
   * @param ebookId - 전자책 ID
   */
  @TypedRoute.Patch('/:ebookId')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @TypedException<TypeGuardError>({
    status: 400,
    description: 'invalid request',
  })
  @TypedException<TypeGuardError>({
    status: 404,
    description: 'Ebook product snapshot not found',
  })
  @TypedException<IErrorResponse<INVALID_LMS_SECRET>>({
    status: INVALID_LMS_SECRET,
    description: 'invalid LMS api secret',
  })
  async updateProductEbook(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('ebookId') ebookId: Uuid,
    @TypedBody() body: UpdateEbookProductDto,
  ): Promise<EbookProductDto> {
    const updated = await this.ebookProductService.updateEbookProduct(
      {
        ebookId,
      },
      {
        ebookProductSnapshotCreateParams: { ...body },
        ebookProductSnapshotAnnouncementCreateParams: body.announcement,
        ebookProductSnapshotContentCreateParams: body.content,
        ebookProductSnapshotRefundPolicyCreateParams: body.refundPolicy,
        ebookProductSnapshotPricingCreateParams: body.pricing,
        ebookProductSnapshotDiscountCreateParams: body.discount
          ? {
              ...body.discount,
              validFrom: body.discount.validFrom
                ? date.toDate(body.discount.validFrom)
                : null,
              validTo: body.discount.validTo
                ? date.toDate(body.discount.validTo)
                : null,
            }
          : undefined,
        ebookProductSnapshotUiContentParams: {
          create: body.uiContents?.create ?? [],
          update: body.uiContents?.update ?? [],
        },
      },
    );

    return ebookProductToDto(updated);
  }
}
