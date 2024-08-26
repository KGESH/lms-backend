import { Controller, UseGuards } from '@nestjs/common';
import {
  TypedBody,
  TypedException,
  TypedHeaders,
  TypedParam,
  TypedRoute,
} from '@nestia/core';
import { EbookProductService } from '@src/v1/product/ebook-product/ebook-product.service';
import { Uuid } from '@src/shared/types/primitive';
import {
  CreateEbookProductDto,
  EbookProductDto,
  UpdateEbookProductDto,
} from '@src/v1/product/ebook-product/ebook-product.dto';
import * as date from '@src/shared/utils/date';
import { TypeGuardError } from 'typia';
import { ebookProductToDto } from '@src/shared/helpers/transofrm/ebook-product';
import { SkipAuth } from '@src/core/decorators/skip-auth.decorator';
import { ApiAuthHeaders, AuthHeaders } from '@src/v1/auth/auth.headers';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';

@Controller('v1/product/ebook')
export class EbookProductController {
  constructor(private readonly ebookProductService: EbookProductService) {}

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
   * refundPolicy: 상품 상세 페이지 환불 정책 rich text content.
   *
   * pricing: 상품 가격 정보.
   *
   * discounts: 상품 할인 정보.
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
   * refundPolicy: 상품 상세 페이지 환불 정책 rich text content.
   *
   * pricing: 상품 가격 정보.
   *
   * discounts: 상품 할인 정보.
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
      ebookProductSnapshotDiscountCreateParams: body.discounts
        ? {
            discountType: body.discounts.discountType,
            value: body.discounts.value,
            validFrom: body.discounts.validFrom
              ? date.toDate(body.discounts.validFrom)
              : null,
            validTo: body.discounts.validTo
              ? date.toDate(body.discounts.validTo)
              : null,
          }
        : null,
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
   * refundPolicy: 상품 상세 페이지 환불 정책 rich text content.
   *
   * pricing: 상품 가격 정보.
   *
   * discounts: 상품 할인 정보.
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
        ebookProductSnapshotDiscountCreateParams: body.discounts
          ? {
              discountType: body.discounts.discountType,
              value: body.discounts.value,
              validFrom: body.discounts.validFrom
                ? date.toDate(body.discounts.validFrom)
                : null,
              validTo: body.discounts.validTo
                ? date.toDate(body.discounts.validTo)
                : null,
            }
          : null,
      },
    );

    return ebookProductToDto(updated);
  }
}
