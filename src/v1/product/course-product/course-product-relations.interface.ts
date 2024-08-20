import { ICourseProduct } from './course-product.interface';
import { IProductSnapshot } from '../common/snapshot/conrse-product-snapshot.interface';
import { IProductSnapshotPricing } from '../common/snapshot/pricing/product-snapshot-pricing.interface';
import { IProductSnapshotDiscount } from '../common/snapshot/discount/product-snapshot-discount.interface';
import { IProductSnapshotContent } from '../common/snapshot/content/product-snapshot-content.interface';
import { IProductSnapshotAnnouncement } from '../common/snapshot/announcement/product-snapshot-announcement.interface';
import { IProductSnapshotRefundPolicy } from '../common/snapshot/refund-policy/product-snapshot-refund-policy.interface';

export type ICourseProductWithLastSnapshot = ICourseProduct & {
  lastSnapshot: IProductSnapshot | null;
};

export type ICourseProductWithRelations = ICourseProduct & {
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
