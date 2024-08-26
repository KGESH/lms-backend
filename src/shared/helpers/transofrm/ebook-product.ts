import { NonNullableInfer } from '@src/shared/types/non-nullable-infer';
import { IEbookProductWithRelations } from '@src/v1/product/ebook-product/ebook-product-relations.interface';
import { EbookProductDto } from '@src/v1/product/ebook-product/ebook-product.dto';
import * as date from '@src/shared/utils/date';

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
  };
};
