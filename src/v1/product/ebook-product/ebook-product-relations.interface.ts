import { IEbookProduct } from '@src/v1/product/ebook-product/ebook-product.interface';
import { IProductSnapshot } from '@src/v1/product/common/snapshot/product-snapshot.interface';
import { IProductSnapshotPricing } from '@src/v1/product/common/snapshot/pricing/product-snapshot-pricing.interface';
import { IProductSnapshotDiscount } from '@src/v1/product/common/snapshot/discount/product-snapshot-discount.interface';
import { IProductSnapshotContent } from '@src/v1/product/common/snapshot/content/product-snapshot-content.interface';
import { IProductSnapshotAnnouncement } from '@src/v1/product/common/snapshot/announcement/product-snapshot-announcement.interface';
import { IProductSnapshotRefundPolicy } from '@src/v1/product/common/snapshot/refund-policy/product-snapshot-refund-policy.interface';
import { IEbookWithRelations } from '@src/v1/ebook/ebook-with-relations.interface';
import { IProductSnapshotUiContentWithFile } from '@src/v1/product/common/snapshot/ui-content/product-snapshot-ui-content.interface';
import { IProductThumbnail } from '@src/v1/product/common/snapshot/thumbnail/product-thumbnail.interface';
import { IEbookProductSnapshotPreview } from '@src/v1/product/ebook-product/snapshot/preview/ebook-product-snapshot-preview.interface';

export type IEbookProductWithLastSnapshot = IEbookProduct & {
  ebook: IEbookWithRelations;
  lastSnapshot: IProductSnapshot | null;
};

export type IEbookProductWithPricing = IEbookProduct & {
  ebook: IEbookWithRelations;
  lastSnapshot: IProductSnapshot & {
    thumbnail: IProductThumbnail;
    pricing: IProductSnapshotPricing;
    discount: IProductSnapshotDiscount;
  };
};

export type IEbookProductWithRelations = IEbookProduct & {
  ebook: IEbookWithRelations;
  lastSnapshot: IProductSnapshot & {
    thumbnail: IProductThumbnail;
    announcement: IProductSnapshotAnnouncement;
    refundPolicy: IProductSnapshotRefundPolicy;
    pricing: IProductSnapshotPricing;
    discount: IProductSnapshotDiscount;
    content: IProductSnapshotContent;
    tableOfContent: IProductSnapshotContent;
    preview: IEbookProductSnapshotPreview;
    uiContents: IProductSnapshotUiContentWithFile[];
  };
};
