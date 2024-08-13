import { ICourseProduct } from './course-product.interface';
import { ICourseProductSnapshot } from './conrse-product-snapshot.interface';
import { ICourseProductSnapshotPricing } from './snapshot/pricing/course-product-snapshot-pricing.interface';
import { ICourseProductSnapshotDiscount } from './snapshot/discount/course-product-snapshot-discount.interface';

export type ICourseProductWithLastSnapshot = ICourseProduct & {
  lastSnapshot: ICourseProductSnapshot | null;
};

export type ICourseProductWithRelations = ICourseProduct & {
  lastSnapshot:
    | (ICourseProductSnapshot & {
        pricing: ICourseProductSnapshotPricing;
        discount: ICourseProductSnapshotDiscount | null;
      })
    | null;
};
