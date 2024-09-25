import { dbSchema } from '../../../../../src/infra/db/schema';
import * as typia from 'typia';
import * as date from '../../../../../src/shared/utils/date';
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
import { DiscountValue, Uuid } from '../../../../../src/shared/types/primitive';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import {
  IProductSnapshotContent,
  IProductSnapshotContentCreate,
} from '../../../../../src/v1/product/common/snapshot/content/product-snapshot-content.interface';
import { IProductSnapshotAnnouncementCreate } from '../../../../../src/v1/product/common/snapshot/announcement/product-snapshot-announcement.interface';
import { IProductSnapshotRefundPolicyCreate } from '../../../../../src/v1/product/common/snapshot/refund-policy/product-snapshot-refund-policy.interface';
import {
  generateRandomDiscount,
  generateRandomPrice,
} from '../../../../../src/shared/helpers/mocks/random-price.mock';
import {
  IProductSnapshotUiContent,
  IProductSnapshotUiContentCreate,
} from '../../../../../src/v1/product/common/snapshot/ui-content/product-snapshot-ui-content.interface';
import { createManyFiles } from './file.helper';

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

export const createCourseProductSnapshotUiContent = async (
  params: IProductSnapshotUiContentCreate[],
  db: TransactionClient,
): Promise<IProductSnapshotUiContent[]> => {
  if (params.length === 0) {
    return [];
  }

  const uiContents = await db
    .insert(dbSchema.courseProductSnapshotUiContents)
    .values(params)
    .returning();

  return uiContents;
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
  index?: number,
): Promise<ICourseProductWithRelations> => {
  const {
    course,
    user,
    userSession,
    teacher,
    category,
    chapters,
    lessons,
    lessonContents,
  } = await createRandomCourse(db);
  const product = await createCourseProduct(
    {
      ...typia.random<ICourseProductCreate>(),
      courseId: course.id,
    },
    db,
  );
  const [thumbnail] = await createManyFiles(
    [
      {
        id: typia.random<Uuid>(),
        metadata: null,
        type: 'image',
        url: 'https://aceternity.com/images/products/thumbnails/new/editrix.png',
      },
    ],
    db,
  );
  const snapshot = await createCourseProductSnapshot(
    {
      ...typia.random<IProductSnapshotCreate>(),
      thumbnailId: thumbnail.id,
      productId: product.id,
      title: `테스트 온라인 강의 ${index ?? ''}`,
      description: '테스트 온라인 강의 상품입니다.',
    } satisfies IProductSnapshotCreate,
    db,
  );
  const announcement = await createCourseProductAnnouncement(
    {
      productSnapshotId: snapshot.id,
      richTextContent: '테스트 공지사항입니다.',
    },
    db,
  );
  const refundPolicy = await createCourseProductSnapshotRefundPolicy(
    {
      productSnapshotId: snapshot.id,
      richTextContent: '테스트 환불 정책입니다.',
    },
    db,
  );
  const content = await createCourseProductSnapshotContent(
    {
      productSnapshotId: snapshot.id,
      richTextContent: '테스트 강의 상품 설명입니다.',
    },
    db,
  );
  const pricing = await createCourseProductSnapshotPricing(
    {
      productSnapshotId: snapshot.id,
      amount: generateRandomPrice(),
    },
    db,
  );
  const discount = await createCourseProductSnapshotDiscount(
    {
      ...generateRandomDiscount(),
      enabled: true,
      productSnapshotId: snapshot.id,
      validFrom: date.now('date'),
      validTo: date.addDate(date.now('date'), 1, 'month', 'date'),
    },
    db,
  );
  const uiContents = await createCourseProductSnapshotUiContent(
    typia.random<IProductSnapshotUiContentCreate[]>().map((params) => ({
      ...params,
      productSnapshotId: snapshot.id,
    })),
    db,
  );

  return {
    ...product,
    course: {
      ...course,
      teacher: {
        ...teacher,
        account: user,
      },
      category,
      chapters: chapters.map((chapter) => ({
        ...chapter,
        lessons: lessons.map((lesson) => ({
          ...lesson,
          lessonContents: lessonContents,
        })),
      })),
    },
    lastSnapshot: {
      ...snapshot,
      thumbnail,
      announcement,
      refundPolicy,
      content,
      pricing,
      discount,
      uiContents,
    },
  };
};

export const seedCourseProducts = async (
  { count }: { count: number },
  db: TransactionClient,
) => {
  return await Promise.all(
    Array.from({ length: count }).map((_, index) =>
      createRandomCourseProduct(db, index + 1),
    ),
  );
};
