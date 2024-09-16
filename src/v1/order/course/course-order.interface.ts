import { Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';
import { IProductSnapshot } from '@src/v1/product/common/snapshot/conrse-product-snapshot.interface';
import { IProductSnapshotContent } from '@src/v1/product/common/snapshot/content/product-snapshot-content.interface';
import { IProductSnapshotDiscount } from '@src/v1/product/common/snapshot/discount/product-snapshot-discount.interface';
import { IProductSnapshotPricing } from '@src/v1/product/common/snapshot/pricing/product-snapshot-pricing.interface';
import { IOrder } from '@src/v1/order/order.interface';
import { ICourseWithRelations } from '@src/v1/course/course-with-relations.interface';

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
      announcement: IProductSnapshotContent;
      refundPolicy: IProductSnapshotContent;
      pricing: IProductSnapshotPricing;
      discount: IProductSnapshotDiscount;
    };
  };
};

export type ICourseOrderWithRelations = IOrder & {
  course: ICourseWithRelations;
};
