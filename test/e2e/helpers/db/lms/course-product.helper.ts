import { dbSchema } from '../../../../../src/infra/db/schema';
import * as typia from 'typia';
import { createRandomCourse } from './course.helper';
import {
  ICourseProduct,
  ICourseProductCreate,
} from '../../../../../src/v1/product/course-product/course-product.interface';
import {
  IProductSnapshot,
  IProductSnapshotCreate,
} from '../../../../../src/v1/product/common/snapshot/conrse-product-snapshot.interface';
import {
  IProductSnapshotPricing,
  IProductSnapshotPricingCreate,
} from '../../../../../src/v1/product/common/snapshot/pricing/product-snapshot-pricing.interface';
import {
  IProductSnapshotDiscount,
  IProductSnapshotDiscountCreate,
} from '../../../../../src/v1/product/common/snapshot/discount/product-snapshot-discount.interface';
import { ICourseProductWithRelations } from '../../../../../src/v1/product/course-product/course-product-relations.interface';
import { DiscountValue } from '../../../../../src/shared/types/primitive';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import {
  IProductSnapshotContent,
  IProductSnapshotContentCreate,
} from '../../../../../src/v1/product/common/snapshot/content/product-snapshot-content.interface';
import { IProductSnapshotAnnouncementCreate } from '../../../../../src/v1/product/common/snapshot/announcement/product-snapshot-announcement.interface';
import { IProductSnapshotRefundPolicyCreate } from '../../../../../src/v1/product/common/snapshot/refund-policy/product-snapshot-refund-policy.interface';

export const createCourseProduct = async (
  params: ICourseProductCreate,
  db: TransactionClient,
): Promise<ICourseProduct> => {
  const [product] = await db
    .insert(dbSchema.courseProducts)
    .values(params)
    .returning();

  return product;
};

export const createCourseProductSnapshot = async (
  params: IProductSnapshotCreate,
  db: TransactionClient,
): Promise<IProductSnapshot> => {
  const [snapshot] = await db
    .insert(dbSchema.courseProductSnapshots)
    .values(params)
    .returning();

  return snapshot;
};

export const createCourseProductAnnouncement = async (
  params: IProductSnapshotAnnouncementCreate,
  db: TransactionClient,
): Promise<IProductSnapshotContent> => {
  const [announcement] = await db
    .insert(dbSchema.courseProductSnapshotAnnouncements)
    .values(params)
    .returning();

  return announcement;
};

export const createCourseProductSnapshotRefundPolicy = async (
  params: IProductSnapshotRefundPolicyCreate,
  db: TransactionClient,
) => {
  const [refundPolicy] = await db
    .insert(dbSchema.courseProductSnapshotRefundPolicies)
    .values(params)
    .returning();

  return refundPolicy;
};

export const createCourseProductSnapshotContent = async (
  params: IProductSnapshotContentCreate,
  db: TransactionClient,
): Promise<IProductSnapshotContent> => {
  const [content] = await db
    .insert(dbSchema.courseProductSnapshotContents)
    .values(params)
    .returning();

  return content;
};

export const createCourseProductSnapshotPricing = async (
  params: IProductSnapshotPricingCreate,
  db: TransactionClient,
): Promise<IProductSnapshotPricing> => {
  const [pricing] = await db
    .insert(dbSchema.courseProductSnapshotPricing)
    .values(params)
    .returning();

  return typia.assert<IProductSnapshotPricing>(pricing);
};

export const createCourseProductSnapshotDiscount = async (
  params: IProductSnapshotDiscountCreate,
  db: TransactionClient,
): Promise<IProductSnapshotDiscount> => {
  const [discount] = await db
    .insert(dbSchema.courseProductSnapshotDiscounts)
    .values(params)
    .returning();

  return {
    ...discount,
    value: typia.assert<DiscountValue>(`${discount.value}`),
  };
};

export const createRandomCourseProduct = async (
  db: TransactionClient,
): Promise<ICourseProductWithRelations> => {
  const { course } = await createRandomCourse(db);
  const product = await createCourseProduct(
    {
      ...typia.random<ICourseProductCreate>(),
      courseId: course.id,
    },
    db,
  );
  const snapshot = await createCourseProductSnapshot(
    {
      ...typia.random<IProductSnapshotCreate>(),
      productId: product.id,
    },
    db,
  );
  const announcement = await createCourseProductAnnouncement(
    {
      ...typia.random<IProductSnapshotContentCreate>(),
      productSnapshotId: snapshot.id,
    },
    db,
  );
  const refundPolicy = await createCourseProductSnapshotRefundPolicy(
    {
      ...typia.random<IProductSnapshotRefundPolicyCreate>(),
      productSnapshotId: snapshot.id,
    },
    db,
  );
  const content = await createCourseProductSnapshotContent(
    {
      ...typia.random<IProductSnapshotContentCreate>(),
      productSnapshotId: snapshot.id,
    },
    db,
  );
  const pricing = await createCourseProductSnapshotPricing(
    {
      ...typia.random<IProductSnapshotPricingCreate>(),
      productSnapshotId: snapshot.id,
    },
    db,
  );
  const discounts = await createCourseProductSnapshotDiscount(
    {
      ...typia.random<IProductSnapshotDiscountCreate>(),
      productSnapshotId: snapshot.id,
    },
    db,
  );

  return {
    ...product,
    lastSnapshot: {
      ...snapshot,
      announcement,
      refundPolicy,
      content,
      pricing,
      discounts,
    },
  };
};

export const seedCourseProducts = async (
  { count }: { count: number },
  db: TransactionClient,
) => {
  return await Promise.all(
    Array.from({ length: count }).map(() => createRandomCourseProduct(db)),
  );
};
