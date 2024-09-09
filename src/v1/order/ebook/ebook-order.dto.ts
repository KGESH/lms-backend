import { OrderBaseDto } from '@src/v1/order/order.dto';
import { EbookWithRelationsDto } from '@src/v1/ebook/ebook-with-relations.dto';

export type EbookOrderDto = OrderBaseDto & {
  ebook: Omit<EbookWithRelationsDto, 'contents'>;
};
