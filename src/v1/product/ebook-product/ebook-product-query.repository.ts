import { Injectable, NotFoundException } from '@nestjs/common';
import * as typia from 'typia';
import { dbSchema } from '@src/infra/db/schema';
import { asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { DiscountValue, Price } from '@src/shared/types/primitive';
import { IEbookProduct } from '@src/v1/product/ebook-product/ebook-product.interface';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IEbookProductWithLastSnapshot,
  IEbookProductWithPricing,
  IEbookProductWithRelations,
} from '@src/v1/product/ebook-product/ebook-product-relations.interface';
import { IProductSnapshotPricing } from '@src/v1/product/common/snapshot/pricing/product-snapshot-pricing.interface';
import { IProductSnapshotContent } from '@src/v1/product/common/snapshot/content/product-snapshot-content.interface';
import { IProductSnapshotAnnouncement } from '@src/v1/product/common/snapshot/announcement/product-snapshot-announcement.interface';
import { IProductSnapshotRefundPolicy } from '@src/v1/product/common/snapshot/refund-policy/product-snapshot-refund-policy.interface';
import { Paginated, Pagination } from '@src/shared/types/pagination';
import { IProductSnapshotDiscount } from '@src/v1/product/common/snapshot/discount/product-snapshot-discount.interface';
import { IProductThumbnail } from '@src/v1/product/common/snapshot/thumbnail/product-thumbnail.interface';

@Injectable()
export class EbookProductQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findEbookProductsWithPricing(
    // orderByColumn  Todo: Impl
    pagination: Pagination,
  ): Promise<Paginated<IEbookProductWithPricing[]>> {
    const productLatestSnapshotQuery = this.drizzle.db
      .select({
        id: dbSchema.ebookProductSnapshots.id,
      })
      .from(dbSchema.ebookProductSnapshots)
      .where(
        eq(dbSchema.ebookProductSnapshots.productId, dbSchema.ebookProducts.id),
      )
      .orderBy(desc(dbSchema.ebookProductSnapshots.createdAt))
      .limit(1);

    const products = await this.drizzle.db
      .select({
        id: dbSchema.ebookProducts.id,
        ebookId: dbSchema.ebookProducts.ebookId,
        ebook: dbSchema.ebooks,
        ebookCategory: dbSchema.ebookCategories,
        teacher: dbSchema.teachers,
        teacherUser: dbSchema.users,
        snapshot: dbSchema.ebookProductSnapshots,
        thumbnail: dbSchema.files,
        pricing: dbSchema.ebookProductSnapshotPricing,
        discount: dbSchema.ebookProductSnapshotDiscounts,
        totalCount: sql<number>`count(*) over()`.mapWith(Number),
      })
      .from(dbSchema.ebookProducts)
      .innerJoin(
        dbSchema.ebooks,
        eq(dbSchema.ebooks.id, dbSchema.ebookProducts.ebookId),
      )
      .innerJoin(
        dbSchema.ebookCategories,
        eq(dbSchema.ebookCategories.id, dbSchema.ebooks.categoryId),
      )
      .innerJoin(
        dbSchema.teachers,
        eq(dbSchema.teachers.id, dbSchema.ebooks.teacherId),
      )
      .innerJoin(
        dbSchema.users,
        eq(dbSchema.users.id, dbSchema.teachers.userId),
      )
      .innerJoin(
        dbSchema.ebookProductSnapshots,
        eq(dbSchema.ebookProductSnapshots.id, productLatestSnapshotQuery),
      )
      .innerJoin(
        dbSchema.files,
        eq(dbSchema.files.id, dbSchema.ebookProductSnapshots.thumbnailId),
      )
      .innerJoin(
        dbSchema.ebookProductSnapshotPricing,
        eq(
          dbSchema.ebookProductSnapshotPricing.productSnapshotId,
          dbSchema.ebookProductSnapshots.id,
        ),
      )
      .leftJoin(
        dbSchema.ebookProductSnapshotDiscounts,
        eq(
          dbSchema.ebookProductSnapshotDiscounts.productSnapshotId,
          dbSchema.ebookProductSnapshots.id,
        ),
      )
      .orderBy(
        pagination.orderBy === 'asc'
          ? asc(dbSchema.ebookProducts.createdAt)
          : desc(dbSchema.ebookProducts.createdAt),
      )
      .offset((pagination.page - 1) * pagination.pageSize)
      .limit(pagination.pageSize);

    return typia.assert<Paginated<IEbookProductWithPricing[]>>({
      pagination,
      totalCount: products[0]?.totalCount ?? 0,
      data: products.map((product) =>
        typia.assert<IEbookProductWithPricing>({
          ...product,
          ebook: {
            ...product.ebook,
            category: product.ebookCategory,
            teacher: {
              ...product.teacher,
              account: product.teacherUser,
            },
            contents: [],
          },
          lastSnapshot: {
            ...product.snapshot,
            thumbnail: product.thumbnail,
            pricing: product.pricing,
            discount: product.discount ?? null,
          },
        }),
      ),
    });
  }

  async findEbookProductWithPricing(
    where: Pick<IEbookProduct, 'ebookId'>,
  ): Promise<IEbookProductWithPricing | null> {
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
      ebook: {
        ...product.ebook,
        teacher: product.ebook.teacher,
        contents: [],
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
    return typia.misc.clone<IEbookProductWithRelations>({
      ...product,
      ebook: {
        ...product.ebook,
        teacher: product.ebook.teacher,
        contents: [],
      },
      lastSnapshot: lastSnapshot
        ? {
            ...lastSnapshot,
            thumbnail: typia.assert<IProductThumbnail>(lastSnapshot.thumbnail),
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
            discount: typia.assert<IProductSnapshotDiscount>({
              ...lastSnapshot.discount,
              value: typia.assert<DiscountValue>(
                `${lastSnapshot.discount!.value}`,
              ),
            }),
            uiContents: lastSnapshot.uiContents ?? [],
          }
        : null,
    } satisfies IEbookProductWithRelations);
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

    return typia.misc.clone<IEbookProductWithLastSnapshot>({
      ...product,
      ebook: {
        ...product.ebook,
        contents: [],
      },
      lastSnapshot: product.snapshots[0] ?? null,
    } satisfies IEbookProductWithLastSnapshot);
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
