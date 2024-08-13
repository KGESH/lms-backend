import { DrizzleService } from '../../../../../src/infra/db/drizzle.service';
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
} from '../../../../../src/v1/product/course-product/conrse-product-snapshot.interface';
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
  Percentage,
  Price,
} from '../../../../../src/shared/types/primitive';

export const createCourseProduct = async (
  params: ICourseProductCreate,
  drizzle: DrizzleService,
): Promise<ICourseProduct> => {
  const [product] = await drizzle.db
    .insert(dbSchema.courseProducts)
    .values(params)
    .returning();

  return product;
};

export const createCourseProductSnapshot = async (
  params: ICourseProductSnapshotCreate,
  drizzle: DrizzleService,
): Promise<ICourseProductSnapshot> => {
  const [snapshot] = await drizzle.db
    .insert(dbSchema.courseProductSnapshots)
    .values(params)
    .returning();

  return snapshot;
};

export const createCourseProductSnapshotPricing = async (
  params: ICourseProductSnapshotPricingCreate,
  drizzle: DrizzleService,
): Promise<ICourseProductSnapshotPricing> => {
  const [pricing] = await drizzle.db
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
  drizzle: DrizzleService,
): Promise<ICourseProductSnapshotDiscount> => {
  const [discount] = await drizzle.db
    .insert(dbSchema.courseProductSnapshotDiscounts)
    .values(params)
    .returning();

  return {
    ...discount,
    value: typia.assert<DiscountValue>(`${discount.value}`),
  };
};

export const createRandomCourseProduct = async (
  drizzle: DrizzleService,
): Promise<ICourseProductWithRelations> => {
  const { course } = await createRandomCourse(drizzle);
  const product = await createCourseProduct(
    {
      ...typia.random<ICourseProductCreate>(),
      courseId: course.id,
    },
    drizzle,
  );
  const snapshot = await createCourseProductSnapshot(
    {
      ...typia.random<ICourseProductSnapshotCreate>(),
      courseProductId: product.id,
    },
    drizzle,
  );
  const pricing = await createCourseProductSnapshotPricing(
    {
      ...typia.random<ICourseProductSnapshotPricingCreate>(),
      courseProductSnapshotId: snapshot.id,
    },
    drizzle,
  );
  const discount = await createCourseProductSnapshotDiscount(
    {
      ...typia.random<ICourseProductSnapshotDiscountCreate>(),
      courseProductSnapshotId: snapshot.id,
    },
    drizzle,
  );

  return {
    ...product,
    lastSnapshot: {
      ...snapshot,
      pricing,
      discount,
    },
  };
};
