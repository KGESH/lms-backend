import { Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';
import { IProductSnapshot } from '@src/v1/product/common/snapshot/conrse-product-snapshot.interface';
import { IProductSnapshotContent } from '@src/v1/product/common/snapshot/content/product-snapshot-content.interface';
import { IProductSnapshotDiscount } from '@src/v1/product/common/snapshot/discount/product-snapshot-discount.interface';
import { IProductSnapshotPricing } from '@src/v1/product/common/snapshot/pricing/product-snapshot-pricing.interface';
import { IOrder } from '@src/v1/order/order.interface';
import { IEbookWithRelations } from '@src/v1/ebook/ebook-with-relations.interface';

export type IEbookOrder = {
  id: Uuid;
  orderId: Uuid;
  productSnapshotId: Uuid;
};

export type IEbookOrderCreate = Optional<IEbookOrder, 'id'>;

export type IEbookOrderRelations = IOrder & {
  productOrder: IEbookOrder & {
    productSnapshot: IProductSnapshot & {
      ebookId: Uuid;
      content: IProductSnapshotContent;
      announcement: IProductSnapshotContent;
      refundPolicy: IProductSnapshotContent;
      pricing: IProductSnapshotPricing;
      discounts: IProductSnapshotDiscount | null;
    };
  };
};

export type IEbookOrderWithRelations = IOrder & {
  ebook: IEbookWithRelations;
};
