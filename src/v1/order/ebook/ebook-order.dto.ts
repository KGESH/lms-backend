import { OrderBaseDto } from '@src/v1/order/order.dto';
import { EbookWithRelationsDto } from '@src/v1/ebook/ebook-with-relations.dto';
import { ProductThumbnailDto } from '@src/v1/product/common/snapshot/thumbnail/product-thumbnail.dto';
import { ISO8601 } from '@src/shared/types/primitive';

export type EbookOrderDto = OrderBaseDto & {
  ebook: Omit<EbookWithRelationsDto, 'contents'> & {
    thumbnail: ProductThumbnailDto;
    validUntil: ISO8601 | null;
  };
};
