import { ICourseProduct } from '@src/v1/product/course-product/course-product.interface';
import { IProductSnapshot } from '@src/v1/product/common/snapshot/conrse-product-snapshot.interface';
import { IProductSnapshotPricing } from '@src/v1/product/common/snapshot/pricing/product-snapshot-pricing.interface';
import { IProductSnapshotDiscount } from '@src/v1/product/common/snapshot/discount/product-snapshot-discount.interface';
import { IProductSnapshotContent } from '@src/v1/product/common/snapshot/content/product-snapshot-content.interface';
import { IProductSnapshotAnnouncement } from '@src/v1/product/common/snapshot/announcement/product-snapshot-announcement.interface';
import { IProductSnapshotRefundPolicy } from '@src/v1/product/common/snapshot/refund-policy/product-snapshot-refund-policy.interface';
import { ICourseWithRelations } from '@src/v1/course/course-with-relations.interface';

export type ICourseProductWithLastSnapshot = ICourseProduct & {
  course: ICourseWithRelations;
  lastSnapshot: IProductSnapshot | null;
};

export type ICourseProductWithRelations = ICourseProduct & {
  course: ICourseWithRelations;
  lastSnapshot:
    | (IProductSnapshot & {
        announcement: IProductSnapshotAnnouncement;
        refundPolicy: IProductSnapshotRefundPolicy;
        pricing: IProductSnapshotPricing;
        discounts: IProductSnapshotDiscount | null;
        content: IProductSnapshotContent;
      })
    | null;
};
