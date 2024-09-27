import { NonNullableInfer } from '@src/shared/types/non-nullable-infer';
import {
  ICourseProductWithPricing,
  ICourseProductWithRelations,
} from '@src/v1/product/course-product/course-product-relations.interface';
import { CourseProductDto } from '@src/v1/product/course-product/course-product.dto';
import * as date from '@src/shared/utils/date';
import { courseRelationsToDto } from '@src/shared/helpers/transofrm/course';

export const courseProductToDto = (
  product: NonNullableInfer<ICourseProductWithRelations>,
): CourseProductDto => {
  return {
    courseId: product.courseId,
    snapshotId: product.lastSnapshot.id,
    title: product.lastSnapshot.title,
    description: product.lastSnapshot.description,
    thumbnailUrl: product.lastSnapshot.thumbnail.url,
    createdAt: date.toISOString(product.lastSnapshot.createdAt),
    updatedAt: date.toISOString(product.lastSnapshot.updatedAt),
    deletedAt: product.lastSnapshot.deletedAt
      ? date.toISOString(product.lastSnapshot.deletedAt)
      : null,
    announcement: product.lastSnapshot.announcement,
    content: product.lastSnapshot.content,
    refundPolicy: product.lastSnapshot.refundPolicy,
    pricing: product.lastSnapshot.pricing,
    discount: {
      ...product.lastSnapshot.discount,
      validFrom: product.lastSnapshot.discount?.validFrom
        ? date.toISOString(product.lastSnapshot.discount.validFrom)
        : null,
      validTo: product.lastSnapshot.discount?.validTo
        ? date.toISOString(product.lastSnapshot.discount.validTo)
        : null,
    },
    uiContents: product.lastSnapshot.uiContents,
    course: courseRelationsToDto(product.course),
  };
};

export const courseProductWithPricingToDto = (
  product: ICourseProductWithPricing,
): Omit<
  CourseProductDto,
  'announcement' | 'content' | 'refundPolicy' | 'uiContents'
> => {
  return {
    courseId: product.courseId,
    snapshotId: product.lastSnapshot.id,
    title: product.lastSnapshot.title,
    thumbnailUrl: product.lastSnapshot.thumbnail.url,
    description: product.lastSnapshot.description,
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
    course: courseRelationsToDto(product.course),
  };
};
