import { ISO8601, PositiveInt, Uri, Uuid } from '@src/shared/types/primitive';
import { ProductSnapshotDiscountDto } from '@src/v1/product/common/snapshot/discount/product-snapshot-discount.dto';
import { ProductSnapshotPricingDto } from '@src/v1/product/common/snapshot/pricing/product-snapshot-pricing.dto';
import { ProductSnapshotContentDto } from '@src/v1/product/common/snapshot/content/product-snapshot-content.dto';
import { ProductSnapshotAnnouncementDto } from '@src/v1/product/common/snapshot/announcement/product-snapshot-announcement.dto';
import { ProductSnapshotRefundPolicyDto } from '@src/v1/product/common/snapshot/refund-policy/product-snapshot-refund-policy.dto';
import { Paginated, Pagination } from '@src/shared/types/pagination';
import { EbookWithRelationsDto } from '@src/v1/ebook/ebook-with-relations.dto';
import {
  ProductSnapshotUiContentDto,
  UpdateUiContentsDto,
} from '@src/v1/product/common/snapshot/ui-content/product-snapshot-ui-content.dto';
import { CreateProductContentDto } from '@src/v1/product/common/snapshot/product-snapshot.dto';

export type EbookProductDto = {
  /**
   * 전자책 ID
   */
  ebookId: Uuid;

  /**
   * 전자책 상품 스냅샷 ID
   */
  snapshotId: Uuid;

  /**
   * 상품 제목
   */
  title: string;

  /**
   * 상품 설명
   */
  description: string | null;

  /**
   * 다운로드 가능 기간(일). null인 경우 무제한
   * ex) availableDays 값이 360인 경우
   * 구매 날짜부터 12개월간 다운로드 가능.
   */
  availableDays: PositiveInt | null;

  /**
   * 상품 썸네일
   */
  thumbnailUrl: Uri;

  /**
   * 강의 정보
   */
  ebook: EbookWithRelationsDto;

  /**
   * 상품 콘텐츠
   */
  content: ProductSnapshotContentDto;

  /**
   * 상품 공지사항
   */
  announcement: ProductSnapshotAnnouncementDto;

  /**
   * 환불 정책
   */
  refundPolicy: ProductSnapshotRefundPolicyDto;

  /**
   * 상품 가격
   */
  pricing: ProductSnapshotPricingDto;

  /**
   * 상품 할인 정보 (상품 자체 할인)
   * ex) 할인이 활성화 되었을경우 구매 페이지 UI에 할인 정보 표시
   */
  discount: ProductSnapshotDiscountDto;

  /**
   * 상품 UI 컨텐츠
   * ex) 메인 배너, 타겟 설명, 말풍선, 태그 등
   */
  uiContents: ProductSnapshotUiContentDto[];

  /**
   * 생성일
   */
  createdAt: ISO8601;

  /**
   * 수정일
   */
  updatedAt: ISO8601;

  /**
   * 삭제일
   */
  deletedAt: ISO8601 | null;
};

export type CreateEbookProductDto = Pick<
  EbookProductDto,
  'title' | 'description' | 'availableDays'
> &
  CreateProductContentDto;

export type UpdateEbookProductParams = {
  snapshot: Pick<EbookProductDto, 'title' | 'description' | 'availableDays'>;
  uiContents: UpdateUiContentsDto;
};

export type UpdateEbookProductDto = Partial<
  Pick<
    CreateEbookProductDto,
    | 'content'
    | 'pricing'
    | 'thumbnail'
    | 'announcement'
    | 'discount'
    | 'refundPolicy'
  > &
    UpdateEbookProductParams
>;

export type PaginatedEbookProducts = Paginated<
  Omit<
    EbookProductDto,
    'announcement' | 'content' | 'refundPolicy' | 'uiContents'
  >[]
>;

export type EbookProductQuery = Partial<Pagination>;
