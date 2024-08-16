import { ICourseProduct } from './course-product.interface';
import { ICourseProductSnapshot } from './snapshot/conrse-product-snapshot.interface';
import { ICourseProductSnapshotPricing } from './snapshot/pricing/course-product-snapshot-pricing.interface';
import { ICourseProductSnapshotDiscount } from './snapshot/discount/course-product-snapshot-discount.interface';
import { ICourseProductSnapshotContent } from './snapshot/content/course-product-snapshot-pricing.interface';

export type ICourseProductWithLastSnapshot = ICourseProduct & {
  lastSnapshot: ICourseProductSnapshot | null;
};

export type ICourseProductWithRelations = ICourseProduct & {
  lastSnapshot:
    | (ICourseProductSnapshot & {
        pricing: ICourseProductSnapshotPricing;
        discount: ICourseProductSnapshotDiscount | null;
        content: ICourseProductSnapshotContent;
      })
    | null;
};
