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

@Injectable()
export class CourseProductQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findCourseProductsWithRelations(
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
      // .innerJoin(
      //   dbSchema.courseProductSnapshotAnnouncements,
      //   eq(
      //     dbSchema.courseProductSnapshotAnnouncements.productSnapshotId,
      //     dbSchema.courseProductSnapshots.id,
      //   ),
      // )
      // .innerJoin(
      //   dbSchema.courseProductSnapshotRefundPolicies,
      //   eq(
      //     dbSchema.courseProductSnapshotRefundPolicies.productSnapshotId,
      //     dbSchema.courseProductSnapshots.id,
      //   ),
      // )
      // .innerJoin(
      //   dbSchema.courseProductSnapshotContents,
      //   eq(
      //     dbSchema.courseProductSnapshotContents.productSnapshotId,
      //     dbSchema.courseProductSnapshots.id,
      //   ),
      // )
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
          pricing: product.pricing,
          discount: product.discount ?? null,
        },
      })),
    });
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
            announcement: true,
            refundPolicy: true,
            content: true,
            pricing: true,
            discounts: true,
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
      lastSnapshot: lastSnapshot
        ? {
            ...lastSnapshot,
            announcement: typia.assert<IProductSnapshotAnnouncement>(
              lastSnapshot.announcement,
            ),
            refundPolicy: typia.assert<IProductSnapshotRefundPolicy>(
              lastSnapshot.refundPolicy,
            ),
            content: typia.assert<IProductSnapshotContent>(
              lastSnapshot.content,
            ),
            pricing: typia.assert<IProductSnapshotPricing>({
              ...lastSnapshot.pricing,
              amount: typia.assert<Price>(`${lastSnapshot.pricing!.amount}`),
            }),
            discounts: lastSnapshot.discounts
              ? {
                  ...lastSnapshot.discounts,
                  value: typia.assert<DiscountValue>(
                    `${lastSnapshot.discounts.value}`,
                  ),
                }
              : null,
          }
        : null,
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

    return {
      ...product,
      course: {
        ...product.course,
        chapters: [],
      },
      lastSnapshot: product.snapshots[0] ?? null,
    };
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
