import { ProductSnapshotContentDto } from '@src/v1/product/common/snapshot/content/product-snapshot-content.dto';
import { ProductSnapshotAnnouncementDto } from '@src/v1/product/common/snapshot/announcement/product-snapshot-announcement.dto';
import { ProductSnapshotRefundPolicyDto } from '@src/v1/product/common/snapshot/refund-policy/product-snapshot-refund-policy.dto';
import { ProductSnapshotPricingDto } from '@src/v1/product/common/snapshot/pricing/product-snapshot-pricing.dto';
import { ProductSnapshotDiscountDto } from '@src/v1/product/common/snapshot/discount/product-snapshot-discount.dto';
import { ProductSnapshotUiContentDto } from '@src/v1/product/common/snapshot/ui-content/product-snapshot-ui-content.dto';
import { ProductThumbnailDto } from '@src/v1/product/common/snapshot/thumbnail/product-thumbnail.dto';

export type CreateProductContentDto = {
  thumbnail: Pick<ProductThumbnailDto, 'id'>;
  content: Pick<ProductSnapshotContentDto, 'richTextContent'>;
  announcement: Pick<ProductSnapshotAnnouncementDto, 'richTextContent'>;
  refundPolicy: Pick<ProductSnapshotRefundPolicyDto, 'richTextContent'>;
  pricing: Pick<ProductSnapshotPricingDto, 'amount'>;
  discount: Omit<ProductSnapshotDiscountDto, 'id' | 'productSnapshotId'>;
  uiContents: Omit<ProductSnapshotUiContentDto, 'id' | 'productSnapshotId'>[];
};
