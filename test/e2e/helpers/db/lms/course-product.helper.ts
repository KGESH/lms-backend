import { dbSchema } from '../../../../../src/infra/db/schema';
import * as typia from 'typia';
import { createRandomCourse } from './course.helper';
import {
  ICourseProduct,
  ICourseProductCreate,
} from '../../../../../src/v1/product/course-product/course-product.interface';
import {
  ICourseProductSnapshot,
  ICourseProductSnapshotCreate,
} from '../../../../../src/v1/product/course-product/snapshot/conrse-product-snapshot.interface';
import {
  ICourseProductSnapshotPricing,
  ICourseProductSnapshotPricingCreate,
} from '../../../../../src/v1/product/course-product/snapshot/pricing/course-product-snapshot-pricing.interface';
import {
  ICourseProductSnapshotDiscount,
  ICourseProductSnapshotDiscountCreate,
} from '../../../../../src/v1/product/course-product/snapshot/discount/course-product-snapshot-discount.interface';
import { ICourseProductWithRelations } from '../../../../../src/v1/product/course-product/course-product-relations.interface';
import {
  DiscountValue,
  Price,
} from '../../../../../src/shared/types/primitive';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import {
  ICourseProductSnapshotContent,
  ICourseProductSnapshotContentCreate,
} from '../../../../../src/v1/product/course-product/snapshot/content/course-product-snapshot-content.interface';

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
  params: ICourseProductSnapshotCreate,
  db: TransactionClient,
): Promise<ICourseProductSnapshot> => {
  const [snapshot] = await db
    .insert(dbSchema.courseProductSnapshots)
    .values(params)
    .returning();

  return snapshot;
};

export const createCourseProductSnapshotContent = async (
  params: ICourseProductSnapshotContentCreate,
  db: TransactionClient,
): Promise<ICourseProductSnapshotContent> => {
  const [content] = await db
    .insert(dbSchema.courseProductSnapshotContents)
    .values(params)
    .returning();

  return content;
};

export const createCourseProductSnapshotPricing = async (
  params: ICourseProductSnapshotPricingCreate,
  db: TransactionClient,
): Promise<ICourseProductSnapshotPricing> => {
  const [pricing] = await db
    .insert(dbSchema.courseProductSnapshotPricing)
    .values(params)
    .returning();

  return {
    ...pricing,
    amount: typia.assert<Price>(`${pricing.amount}`),
  };
};

export const createCourseProductSnapshotDiscount = async (
  params: ICourseProductSnapshotDiscountCreate,
  db: TransactionClient,
): Promise<ICourseProductSnapshotDiscount> => {
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
      ...typia.random<ICourseProductSnapshotCreate>(),
      courseProductId: product.id,
    },
    db,
  );
  const content = await createCourseProductSnapshotContent(
    {
      ...typia.random<ICourseProductSnapshotContentCreate>(),
      courseProductSnapshotId: snapshot.id,
    },
    db,
  );
  const pricing = await createCourseProductSnapshotPricing(
    {
      ...typia.random<ICourseProductSnapshotPricingCreate>(),
      courseProductSnapshotId: snapshot.id,
    },
    db,
  );
  const discount = await createCourseProductSnapshotDiscount(
    {
      ...typia.random<ICourseProductSnapshotDiscountCreate>(),
      courseProductSnapshotId: snapshot.id,
    },
    db,
  );

  return {
    ...product,
    lastSnapshot: {
      ...snapshot,
      content,
      pricing,
      discount,
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
