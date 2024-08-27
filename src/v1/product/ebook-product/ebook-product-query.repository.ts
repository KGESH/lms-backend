import { Injectable, NotFoundException } from '@nestjs/common';
import * as typia from 'typia';
import { dbSchema } from '@src/infra/db/schema';
import { desc, eq, isNull } from 'drizzle-orm';
import { DiscountValue, Price } from '@src/shared/types/primitive';
import { IEbookProduct } from '@src/v1/product/ebook-product/ebook-product.interface';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IEbookProductWithLastSnapshot,
  IEbookProductWithRelations,
} from '@src/v1/product/ebook-product/ebook-product-relations.interface';
import { IProductSnapshotPricing } from '@src/v1/product/common/snapshot/pricing/product-snapshot-pricing.interface';
import { IProductSnapshotContent } from '@src/v1/product/common/snapshot/content/product-snapshot-content.interface';
import { IProductSnapshotAnnouncement } from '@src/v1/product/common/snapshot/announcement/product-snapshot-announcement.interface';
import { IProductSnapshotRefundPolicy } from '@src/v1/product/common/snapshot/refund-policy/product-snapshot-refund-policy.interface';

@Injectable()
export class EbookProductQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findEbookProducts() {
    const products = await this.drizzle.db.query.ebookProducts.findMany({
      with: {
        snapshots: true,
        ebook: {
          with: {
            teacher: true,
          },
        },
      },
    });
  }

  async findEbookProductWithRelations(
    where: Pick<IEbookProduct, 'ebookId'>,
  ): Promise<IEbookProductWithRelations | null> {
    const product = await this.drizzle.db.query.ebookProducts.findFirst({
      where: eq(dbSchema.ebookProducts.ebookId, where.ebookId),
      with: {
        ebook: {
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
          where: isNull(dbSchema.ebookProductSnapshots.deletedAt),
          orderBy: desc(dbSchema.ebookProductSnapshots.createdAt),
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
      ebook: {
        ...product.ebook,
        teacher: product.ebook.teacher,
        contents: [],
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
    } satisfies IEbookProductWithRelations;
  }

  async findEbookProductWithLastSnapshot({
    ebookId,
  }: Pick<
    IEbookProduct,
    'ebookId'
  >): Promise<IEbookProductWithLastSnapshot | null> {
    const product = await this.drizzle.db.query.ebookProducts.findFirst({
      where: eq(dbSchema.ebookProducts.ebookId, ebookId),
      with: {
        ebook: {
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
          where: isNull(dbSchema.ebookProductSnapshots.deletedAt),
          orderBy: desc(dbSchema.ebookProductSnapshots.createdAt),
          limit: 1,
        },
      },
    });

    if (!product) {
      return null;
    }

    return {
      ...product,
      ebook: {
        ...product.ebook,
        contents: [],
      },
      lastSnapshot: product.snapshots[0] ?? null,
    };
  }

  async findEbookProductWithLastSnapshotOrThrow({
    ebookId,
  }: Pick<IEbookProduct, 'ebookId'>): Promise<IEbookProductWithLastSnapshot> {
    const product = await this.findEbookProductWithLastSnapshot({ ebookId });

    if (!product) {
      throw new NotFoundException('Ebook product not found');
    }

    return product;
  }
}
