import { Injectable } from '@nestjs/common';
import * as typia from 'typia';
import { dbSchema } from '@src/infra/db/schema';
import { desc, eq, isNull } from 'drizzle-orm';
import { DiscountValue, Price } from '@src/shared/types/primitive';
import { ICourseProduct } from '@src/v1/product/course-product/course-product.interface';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  ICourseProductWithLastSnapshot,
  ICourseProductWithRelations,
} from '@src/v1/product/course-product/course-product-relations.interface';
import { IProductSnapshotPricing } from '@src/v1/product/common/snapshot/pricing/product-snapshot-pricing.interface';
import { IProductSnapshotContent } from '@src/v1/product/common/snapshot/content/product-snapshot-content.interface';
import { IProductSnapshotAnnouncement } from '@src/v1/product/common/snapshot/announcement/product-snapshot-announcement.interface';
import { IProductSnapshotRefundPolicy } from '@src/v1/product/common/snapshot/refund-policy/product-snapshot-refund-policy.interface';

@Injectable()
export class CourseProductQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findOneWithRelations(
    where: Pick<ICourseProduct, 'courseId'>,
  ): Promise<ICourseProductWithRelations | null> {
    const product = await this.drizzle.db.query.courseProducts.findFirst({
      where: eq(dbSchema.courseProducts.courseId, where.courseId),
      with: {
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

  async findOneWithLastSnapshot({
    courseId,
  }: Pick<
    ICourseProduct,
    'courseId'
  >): Promise<ICourseProductWithLastSnapshot | null> {
    const product = await this.drizzle.db.query.courseProducts.findFirst({
      where: eq(dbSchema.courseProducts.courseId, courseId),
      with: {
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
      lastSnapshot: product.snapshots[0] ?? null,
    };
  }
}
