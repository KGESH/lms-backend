import { NonNullableInfer } from '@src/shared/types/non-nullable-infer';
import {
  IEbookProductWithPricing,
  IEbookProductWithRelations,
} from '@src/v1/product/ebook-product/ebook-product-relations.interface';
import { EbookProductDto } from '@src/v1/product/ebook-product/ebook-product.dto';
import * as date from '@src/shared/utils/date';
import { ebookRelationsToDto } from '@src/shared/helpers/transofrm/ebook';

export const ebookProductToDto = (
  product: NonNullableInfer<IEbookProductWithRelations>,
): EbookProductDto => {
  return {
    ebookId: product.ebookId,
    snapshotId: product.lastSnapshot.id,
    title: product.lastSnapshot.title,
    description: product.lastSnapshot.description,
    createdAt: date.toISOString(product.lastSnapshot.createdAt),
    updatedAt: date.toISOString(product.lastSnapshot.updatedAt),
    deletedAt: product.lastSnapshot.deletedAt
      ? date.toISOString(product.lastSnapshot.deletedAt)
      : null,
    announcement: product.lastSnapshot.announcement,
    content: product.lastSnapshot.content,
    refundPolicy: product.lastSnapshot.refundPolicy,
    pricing: product.lastSnapshot.pricing,
    discounts: product.lastSnapshot.discounts
      ? {
          ...product.lastSnapshot.discounts,
          validFrom: product.lastSnapshot.discounts?.validFrom
            ? date.toISOString(product.lastSnapshot.discounts.validFrom)
            : null,
          validTo: product.lastSnapshot.discounts?.validTo
            ? date.toISOString(product.lastSnapshot.discounts.validTo)
            : null,
        }
      : null,
    ebook: ebookRelationsToDto(product.ebook),
  };
};

export const ebookProductWithPricingToDto = (
  product: IEbookProductWithPricing,
): Omit<EbookProductDto, 'announcement' | 'content' | 'refundPolicy'> => {
  return {
    ebookId: product.ebookId,
    snapshotId: product.lastSnapshot.id,
    title: product.lastSnapshot.title,
    description: product.lastSnapshot.description,
    createdAt: date.toISOString(product.lastSnapshot.createdAt),
    updatedAt: date.toISOString(product.lastSnapshot.updatedAt),
    deletedAt: product.lastSnapshot.deletedAt
      ? date.toISOString(product.lastSnapshot.deletedAt)
      : null,
    pricing: product.lastSnapshot.pricing,
    discounts: product.lastSnapshot.discount
      ? {
          ...product.lastSnapshot.discount,
          validFrom: product.lastSnapshot.discount.validFrom
            ? date.toISOString(product.lastSnapshot.discount.validFrom)
            : null,
          validTo: product.lastSnapshot.discount.validTo
            ? date.toISOString(product.lastSnapshot.discount.validTo)
            : null,
        }
      : null,
    ebook: ebookRelationsToDto(product.ebook),
  };
};
