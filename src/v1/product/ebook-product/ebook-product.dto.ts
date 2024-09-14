import { ISO8601, Uuid } from '@src/shared/types/primitive';
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
import { CreateProductContentDto } from '@src/v1/product/common/snapshot/course-product-snapshot.dto';

export type EbookProductDto = {
  ebookId: Uuid;
  snapshotId: Uuid;
  title: string;
  description: string | null;
  ebook: EbookWithRelationsDto;
  content: ProductSnapshotContentDto;
  announcement: ProductSnapshotAnnouncementDto;
  refundPolicy: ProductSnapshotRefundPolicyDto;
  pricing: ProductSnapshotPricingDto;
  discounts: ProductSnapshotDiscountDto | null;
  uiContents: ProductSnapshotUiContentDto[];
  createdAt: ISO8601;
  updatedAt: ISO8601;
  deletedAt: ISO8601 | null;
};

export type CreateEbookProductDto = Pick<
  EbookProductDto,
  'title' | 'description'
> &
  CreateProductContentDto;

export type UpdateEbookProductDto = Partial<
  Omit<CreateEbookProductDto, 'uiContents'> & {
    uiContents: UpdateUiContentsDto;
  }
>;

export type PaginatedEbookProducts = Paginated<
  Omit<
    EbookProductDto,
    'announcement' | 'content' | 'refundPolicy' | 'uiContents'
  >[]
>;

export type EbookProductQuery = Partial<Pagination>;
