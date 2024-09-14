import { ProductUiContentType, UInt, Uuid } from '@src/shared/types/primitive';
import { RequiredField } from '@src/shared/types/required-field';
import { ProductSnapshotContentDto } from '@src/v1/product/common/snapshot/content/product-snapshot-content.dto';
import { ProductSnapshotAnnouncementDto } from '@src/v1/product/common/snapshot/announcement/product-snapshot-announcement.dto';
import { ProductSnapshotRefundPolicyDto } from '@src/v1/product/common/snapshot/refund-policy/product-snapshot-refund-policy.dto';
import { ProductSnapshotPricingDto } from '@src/v1/product/common/snapshot/pricing/product-snapshot-pricing.dto';
import { ProductSnapshotDiscountDto } from '@src/v1/product/common/snapshot/discount/product-snapshot-discount.dto';

export type ProductSnapshotUiContentDto = {
  id: Uuid;
  productSnapshotId: Uuid;
  type: ProductUiContentType;
  content: string;
  description: string | null;
  sequence: UInt | null;
  url: string | null;
  metadata: string | null;
};

export type ProductContentDto = {
  content: Pick<ProductSnapshotContentDto, 'richTextContent'>;
  announcement: Pick<ProductSnapshotAnnouncementDto, 'richTextContent'>;
  refundPolicy: Pick<ProductSnapshotRefundPolicyDto, 'richTextContent'>;
  pricing: Pick<ProductSnapshotPricingDto, 'amount'>;
  discounts: Omit<
    ProductSnapshotDiscountDto,
    'id' | 'productSnapshotId'
  > | null;
  uiContents: Omit<ProductSnapshotUiContentDto, 'id' | 'productSnapshotId'>[];
};

export type UpdateUiContentsDto = {
  create: Omit<ProductSnapshotUiContentDto, 'id' | 'productSnapshotId'>[];
  update: RequiredField<Partial<ProductSnapshotUiContentDto>, 'id'>[];
};
