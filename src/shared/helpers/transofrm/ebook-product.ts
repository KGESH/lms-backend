import {
  IEbookProductWithPricing,
  IEbookProductWithRelations,
} from '@src/v1/product/ebook-product/ebook-product-relations.interface';
import { EbookProductDto } from '@src/v1/product/ebook-product/ebook-product.dto';
import * as date from '@src/shared/utils/date';
import { ebookRelationsToDto } from '@src/shared/helpers/transofrm/ebook';

export const ebookProductToDto = (
  product: IEbookProductWithRelations,
): EbookProductDto => {
  return {
    ebookId: product.ebookId,
    snapshotId: product.lastSnapshot.id,
    title: product.lastSnapshot.title,
    description: product.lastSnapshot.description,
    thumbnailUrl: product.lastSnapshot.thumbnail.url,
    availableDays: product.lastSnapshot.availableDays,
    createdAt: date.toISOString(product.lastSnapshot.createdAt),
    updatedAt: date.toISOString(product.lastSnapshot.updatedAt),
    deletedAt: date.toIsoStringOrNull(product.lastSnapshot.deletedAt),
    announcement: product.lastSnapshot.announcement,
    content: product.lastSnapshot.content,
    refundPolicy: product.lastSnapshot.refundPolicy,
    pricing: product.lastSnapshot.pricing,
    discount: {
      ...product.lastSnapshot.discount,
      validFrom: date.toIsoStringOrNull(
        product.lastSnapshot.discount.validFrom,
      ),
      validTo: date.toIsoStringOrNull(product.lastSnapshot.discount.validTo),
    },
    uiContents: product.lastSnapshot.uiContents,
    ebook: ebookRelationsToDto(product.ebook),
  };
};

export const ebookProductWithPricingToDto = (
  product: IEbookProductWithPricing,
): Omit<
  EbookProductDto,
  'announcement' | 'content' | 'refundPolicy' | 'uiContents'
> => {
  return {
    ebookId: product.ebookId,
    snapshotId: product.lastSnapshot.id,
    title: product.lastSnapshot.title,
    description: product.lastSnapshot.description,
    thumbnailUrl: product.lastSnapshot.thumbnail.url,
    availableDays: product.lastSnapshot.availableDays,
    createdAt: date.toISOString(product.lastSnapshot.createdAt),
    updatedAt: date.toISOString(product.lastSnapshot.updatedAt),
    deletedAt: date.toIsoStringOrNull(product.lastSnapshot.deletedAt),
    pricing: product.lastSnapshot.pricing,
    discount: {
      ...product.lastSnapshot.discount,
      validFrom: date.toIsoStringOrNull(
        product.lastSnapshot.discount.validFrom,
      ),
      validTo: date.toIsoStringOrNull(product.lastSnapshot.discount.validTo),
    },
    ebook: ebookRelationsToDto(product.ebook),
  };
};
