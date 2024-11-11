import { ICourseProduct } from '@src/v1/product/course-product/course-product.interface';
import { IProductSnapshot } from '@src/v1/product/common/snapshot/product-snapshot.interface';
import { IProductSnapshotPricing } from '@src/v1/product/common/snapshot/pricing/product-snapshot-pricing.interface';
import { IProductSnapshotDiscount } from '@src/v1/product/common/snapshot/discount/product-snapshot-discount.interface';
import { IProductSnapshotContent } from '@src/v1/product/common/snapshot/content/product-snapshot-content.interface';
import { IProductSnapshotAnnouncement } from '@src/v1/product/common/snapshot/announcement/product-snapshot-announcement.interface';
import { IProductSnapshotRefundPolicy } from '@src/v1/product/common/snapshot/refund-policy/product-snapshot-refund-policy.interface';
import { ICourseWithRelations } from '@src/v1/course/course-with-relations.interface';
import { IProductSnapshotUiContentWithFile } from '@src/v1/product/common/snapshot/ui-content/product-snapshot-ui-content.interface';
import { IProductThumbnail } from '@src/v1/product/common/snapshot/thumbnail/product-thumbnail.interface';

export type ICourseProductWithLastSnapshot = ICourseProduct & {
  course: ICourseWithRelations;
  lastSnapshot: IProductSnapshot | null;
};

export type ICourseProductWithPricing = ICourseProduct & {
  course: ICourseWithRelations;
  lastSnapshot: IProductSnapshot & {
    thumbnail: IProductThumbnail;
    pricing: IProductSnapshotPricing;
    discount: IProductSnapshotDiscount;
  };
};

export type ICourseProductWithRelations = ICourseProduct & {
  course: ICourseWithRelations;
  lastSnapshot: IProductSnapshot & {
    thumbnail: IProductThumbnail;
    announcement: IProductSnapshotAnnouncement;
    refundPolicy: IProductSnapshotRefundPolicy;
    pricing: IProductSnapshotPricing;
    discount: IProductSnapshotDiscount;
    content: IProductSnapshotContent;
    uiContents: IProductSnapshotUiContentWithFile[];
  };
};
