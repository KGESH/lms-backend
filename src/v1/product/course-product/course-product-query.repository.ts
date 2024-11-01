import { Injectable, NotFoundException } from '@nestjs/common';
import * as typia from 'typia';
import { dbSchema } from '@src/infra/db/schema';
import { asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { DiscountValue, Price } from '@src/shared/types/primitive';
import { ICourseProduct } from '@src/v1/product/course-product/course-product.interface';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  ICourseProductWithLastSnapshot,
  ICourseProductWithPricing,
  ICourseProductWithRelations,
} from '@src/v1/product/course-product/course-product-relations.interface';
import { IProductSnapshotPricing } from '@src/v1/product/common/snapshot/pricing/product-snapshot-pricing.interface';
import { IProductSnapshotContent } from '@src/v1/product/common/snapshot/content/product-snapshot-content.interface';
import { IProductSnapshotAnnouncement } from '@src/v1/product/common/snapshot/announcement/product-snapshot-announcement.interface';
import { IProductSnapshotRefundPolicy } from '@src/v1/product/common/snapshot/refund-policy/product-snapshot-refund-policy.interface';
import { Paginated, Pagination } from '@src/shared/types/pagination';
import { IProductSnapshotDiscount } from '@src/v1/product/common/snapshot/discount/product-snapshot-discount.interface';
import { IProductThumbnail } from '@src/v1/product/common/snapshot/thumbnail/product-thumbnail.interface';

@Injectable()
export class CourseProductQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findCourseProductsWithPricing(
    // orderByColumn  Todo: Impl
    pagination: Pagination,
  ): Promise<Paginated<ICourseProductWithPricing[]>> {
    const productLatestSnapshotQuery = this.drizzle.db
      .select({
        id: dbSchema.courseProductSnapshots.id,
      })
      .from(dbSchema.courseProductSnapshots)
      .where(
        eq(
          dbSchema.courseProductSnapshots.productId,
          dbSchema.courseProducts.id,
        ),
      )
      .orderBy(desc(dbSchema.courseProductSnapshots.createdAt))
      .limit(1);

    const products = await this.drizzle.db
      .select({
        id: dbSchema.courseProducts.id,
        courseId: dbSchema.courseProducts.courseId,
        course: dbSchema.courses,
        courseCategory: dbSchema.courseCategories,
        teacher: dbSchema.teachers,
        teacherUser: dbSchema.users,
        snapshot: dbSchema.courseProductSnapshots,
        thumbnail: dbSchema.files,
        pricing: dbSchema.courseProductSnapshotPricing,
        discount: dbSchema.courseProductSnapshotDiscounts,
        totalCount: sql<number>`count(*) over()`.mapWith(Number),
      })
      .from(dbSchema.courseProducts)
      .innerJoin(
        dbSchema.courses,
        eq(dbSchema.courses.id, dbSchema.courseProducts.courseId),
      )
      .innerJoin(
        dbSchema.courseCategories,
        eq(dbSchema.courseCategories.id, dbSchema.courses.categoryId),
      )
      .innerJoin(
        dbSchema.teachers,
        eq(dbSchema.teachers.id, dbSchema.courses.teacherId),
      )
      .innerJoin(
        dbSchema.users,
        eq(dbSchema.users.id, dbSchema.teachers.userId),
      )
      .innerJoin(
        dbSchema.courseProductSnapshots,
        eq(dbSchema.courseProductSnapshots.id, productLatestSnapshotQuery),
      )
      .innerJoin(
        dbSchema.files,
        eq(dbSchema.files.id, dbSchema.courseProductSnapshots.thumbnailId),
      )
      .innerJoin(
        dbSchema.courseProductSnapshotPricing,
        eq(
          dbSchema.courseProductSnapshotPricing.productSnapshotId,
          dbSchema.courseProductSnapshots.id,
        ),
      )
      .leftJoin(
        dbSchema.courseProductSnapshotDiscounts,
        eq(
          dbSchema.courseProductSnapshotDiscounts.productSnapshotId,
          dbSchema.courseProductSnapshots.id,
        ),
      )
      .orderBy(
        pagination.orderBy === 'asc'
          ? asc(dbSchema.courseProducts.createdAt)
          : desc(dbSchema.courseProducts.createdAt),
      )
      .offset((pagination.page - 1) * pagination.pageSize)
      .limit(pagination.pageSize);

    return typia.assert<Paginated<ICourseProductWithPricing[]>>({
      pagination,
      totalCount: products[0]?.totalCount ?? 0,
      data: products.map((product) => ({
        ...product,
        course: {
          ...product.course,
          category: product.courseCategory,
          teacher: {
            ...product.teacher,
            account: product.teacherUser,
          },
          chapters: [],
        },
        lastSnapshot: {
          ...product.snapshot,
          thumbnail: product.thumbnail,
          pricing: product.pricing,
          discount: product.discount ?? null,
        },
      })),
    });
  }

  async findCourseProductWithPricing(
    where: Pick<ICourseProduct, 'courseId'>,
  ): Promise<ICourseProductWithPricing | null> {
    const product = await this.drizzle.db.query.courseProducts.findFirst({
      where: eq(dbSchema.courseProducts.courseId, where.courseId),
      with: {
        course: {
          with: {
            category: true,
            teacher: {
              with: {
                account: true,
              },
            },
          },
        },
        snapshots: {
          where: isNull(dbSchema.courseProductSnapshots.deletedAt),
          orderBy: desc(dbSchema.courseProductSnapshots.createdAt),
          limit: 1,
          with: {
            thumbnail: true,
            pricing: true,
            discount: true,
          },
        },
      },
    });

    if (!product?.snapshots[0]) {
      return null;
    }

    return {
      ...product,
      course: {
        ...product.course,
        teacher: product.course.teacher,
        chapters: [],
      },
      lastSnapshot: {
        ...product.snapshots[0],
        thumbnail: typia.assert<IProductThumbnail>(
          product.snapshots[0].thumbnail,
        ),
        pricing: typia.assert<IProductSnapshotPricing>({
          ...product.snapshots[0].pricing,
          amount: typia.assert<Price>(
            `${product.snapshots[0].pricing!.amount}`,
          ),
        }),
        discount: typia.assert<IProductSnapshotDiscount>({
          ...product.snapshots[0].discount,
          value: typia.assert<DiscountValue>(
            `${product.snapshots[0].discount!.value}`,
          ),
        }),
      },
    };
  }

  async findCourseProductWithRelations(
    where: Pick<ICourseProduct, 'courseId'>,
  ): Promise<ICourseProductWithRelations | null> {
    const product = await this.drizzle.db.query.courseProducts.findFirst({
      where: eq(dbSchema.courseProducts.courseId, where.courseId),
      with: {
        course: {
          with: {
            category: true,
            teacher: {
              with: {
                account: true,
              },
            },
            chapters: {
              with: {
                lessons: true,
              },
            },
          },
        },
        snapshots: {
          where: isNull(dbSchema.courseProductSnapshots.deletedAt),
          orderBy: desc(dbSchema.courseProductSnapshots.createdAt),
          limit: 1,
          with: {
            thumbnail: true,
            announcement: true,
            refundPolicy: true,
            content: true,
            pricing: true,
            discount: true,
            uiContents: true,
          },
        },
      },
    });

    if (!product?.snapshots[0]) {
      return null;
    }

    const lastSnapshot = product.snapshots[0];
    return {
      ...product,
      course: {
        ...product.course,
        teacher: product.course.teacher,
        chapters: product.course.chapters.map((chapter) => ({
          ...chapter,
          lessons: chapter.lessons.map((lesson) => ({
            ...lesson,
            lessonContents: [],
          })),
        })),
      },
      lastSnapshot: {
        ...lastSnapshot,
        thumbnail: typia.assert<IProductThumbnail>(lastSnapshot.thumbnail),
        announcement: typia.assert<IProductSnapshotAnnouncement>(
          lastSnapshot.announcement,
        ),
        refundPolicy: typia.assert<IProductSnapshotRefundPolicy>(
          lastSnapshot.refundPolicy,
        ),
        content: typia.assert<IProductSnapshotContent>(lastSnapshot.content),
        pricing: typia.assert<IProductSnapshotPricing>({
          ...lastSnapshot.pricing,
          amount: typia.assert<Price>(`${lastSnapshot.pricing!.amount}`),
        }),
        discount: typia.assert<IProductSnapshotDiscount>({
          ...lastSnapshot.discount,
          value: `${lastSnapshot.discount!.value}`,
        }),
        uiContents: lastSnapshot.uiContents ?? [],
      },
    };
  }

  async findCourseProductWithLastSnapshot({
    courseId,
  }: Pick<
    ICourseProduct,
    'courseId'
  >): Promise<ICourseProductWithLastSnapshot | null> {
    const product = await this.drizzle.db.query.courseProducts.findFirst({
      where: eq(dbSchema.courseProducts.courseId, courseId),
      with: {
        course: {
          with: {
            category: true,
            teacher: {
              with: {
                account: true,
              },
            },
          },
        },
        snapshots: {
          where: isNull(dbSchema.courseProductSnapshots.deletedAt),
          orderBy: desc(dbSchema.courseProductSnapshots.createdAt),
          limit: 1,
        },
      },
    });

    if (!product) {
      return null;
    }

    return typia.misc.clone<ICourseProductWithLastSnapshot>({
      ...product,
      course: {
        ...product.course,
        chapters: [],
      },
      lastSnapshot: product.snapshots[0] ?? null,
    } satisfies ICourseProductWithLastSnapshot);
  }

  async findCourseProductWithLastSnapshotOrThrow({
    courseId,
  }: Pick<
    ICourseProduct,
    'courseId'
  >): Promise<ICourseProductWithLastSnapshot> {
    const product = await this.findCourseProductWithLastSnapshot({ courseId });

    if (!product) {
      throw new NotFoundException('Course product not found');
    }

    return product;
  }
}
