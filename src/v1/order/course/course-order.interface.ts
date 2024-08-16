import { Uuid } from '../../../shared/types/primitive';
import { Optional } from '../../../shared/types/optional';
import { IProductSnapshot } from '../../product/common/snapshot/conrse-product-snapshot.interface';
import { IProductSnapshotContent } from '../../product/common/snapshot/content/product-snapshot-content.interface';
import { IProductSnapshotDiscount } from '../../product/common/snapshot/discount/product-snapshot-discount.interface';
import { IProductSnapshotPricing } from '../../product/common/snapshot/pricing/product-snapshot-pricing.interface';
import { IOrder } from '../order.interface';

export type ICourseOrder = {
  id: Uuid;
  orderId: Uuid;
  productSnapshotId: Uuid;
};

export type ICourseOrderCreate = Optional<ICourseOrder, 'id'>;

export type ICourseOrderRelations = IOrder & {
  productOrder: ICourseOrder & {
    productSnapshot: IProductSnapshot & {
      courseId: Uuid;
      content: IProductSnapshotContent;
      pricing: IProductSnapshotPricing;
      discounts: IProductSnapshotDiscount | null;
    };
  };
};
