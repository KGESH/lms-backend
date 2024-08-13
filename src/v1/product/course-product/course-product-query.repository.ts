import { Injectable } from '@nestjs/common';
import * as typia from 'typia';
import { dbSchema } from '../../../infra/db/schema';
import { ICourseProduct } from './course-product.interface';
import { DrizzleService } from '../../../infra/db/drizzle.service';
import { desc, eq, isNull } from 'drizzle-orm';
import {
  ICourseProductWithLastSnapshot,
  ICourseProductWithRelations,
} from './course-product-relations.interface';
import { ICourseProductSnapshotPricing } from './snapshot/pricing/course-product-snapshot-pricing.interface';
import { DiscountValue, Price } from '../../../shared/types/primitive';

@Injectable()
export class CourseProductQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findOneWithRelations({
    courseId,
  }: Pick<
    ICourseProduct,
    'courseId'
  >): Promise<ICourseProductWithRelations | null> {
    const product = await this.drizzle.db.query.courseProducts.findFirst({
      where: eq(dbSchema.courseProducts.courseId, courseId),
      with: {
        snapshots: {
          where: isNull(dbSchema.courseProductSnapshots.deletedAt),
          orderBy: desc(dbSchema.courseProductSnapshots.createdAt),
          limit: 1,
          with: {
            pricing: true,
            discounts: true,
          },
        },
      },
    });

    if (!product?.snapshots[0]) {
      return null;
    }

    console.log(product.snapshots[0]);
    console.log(product.snapshots[0].pricing);
    console.log(product.snapshots[0].discounts);

    const lastSnapshot = product.snapshots[0];
    return {
      ...product,
      lastSnapshot: lastSnapshot
        ? {
            ...lastSnapshot,
            pricing: typia.assert<ICourseProductSnapshotPricing>({
              ...lastSnapshot.pricing,
              amount: typia.assert<Price>(`${lastSnapshot.pricing!.amount}`),
            }),
            discount: lastSnapshot.discounts
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
    // return {
    //   ...product,
    //   lastSnapshot: lastSnapshot
    //     ? {
    //       ...lastSnapshot,
    //       pricing: {
    //         ...lastSnapshot.pricing,
    //         amount: typia.assert<Price>(`${lastSnapshot.pricing.amount}`),
    //       },
    //     },
    //
    //         discount: product.snapshots[0].discounts
    //           ? typia.assert<ICourseProductSnapshotDiscount>(
    //               product.snapshots[0].discounts,
    //             )
    //           : null,
    //       }
    //     : null,
    // };
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
