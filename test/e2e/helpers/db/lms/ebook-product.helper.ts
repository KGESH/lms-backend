import { dbSchema } from '../../../../../src/infra/db/schema';
import * as typia from 'typia';
import { createRandomEbook } from './ebook.helper';
import {
  IEbookProduct,
  IEbookProductCreate,
} from '../../../../../src/v1/product/ebook-product/ebook-product.interface';
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
import { IEbookProductWithRelations } from '../../../../../src/v1/product/ebook-product/ebook-product-relations.interface';
import { DiscountValue } from '../../../../../src/shared/types/primitive';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import {
  IProductSnapshotContent,
  IProductSnapshotContentCreate,
} from '../../../../../src/v1/product/common/snapshot/content/product-snapshot-content.interface';
import { IProductSnapshotAnnouncementCreate } from '../../../../../src/v1/product/common/snapshot/announcement/product-snapshot-announcement.interface';
import { IProductSnapshotRefundPolicyCreate } from '../../../../../src/v1/product/common/snapshot/refund-policy/product-snapshot-refund-policy.interface';

export const createEbookProduct = async (
  params: IEbookProductCreate,
  db: TransactionClient,
): Promise<IEbookProduct> => {
  const [product] = await db
    .insert(dbSchema.ebookProducts)
    .values(params)
    .returning();

  return product;
};

export const createEbookProductSnapshot = async (
  params: IProductSnapshotCreate,
  db: TransactionClient,
): Promise<IProductSnapshot> => {
  const [snapshot] = await db
    .insert(dbSchema.ebookProductSnapshots)
    .values(params)
    .returning();

  return snapshot;
};

export const createEbookProductAnnouncement = async (
  params: IProductSnapshotAnnouncementCreate,
  db: TransactionClient,
): Promise<IProductSnapshotContent> => {
  const [announcement] = await db
    .insert(dbSchema.ebookProductSnapshotAnnouncements)
    .values(params)
    .returning();

  return announcement;
};

export const createEbookProductSnapshotRefundPolicy = async (
  params: IProductSnapshotRefundPolicyCreate,
  db: TransactionClient,
) => {
  const [refundPolicy] = await db
    .insert(dbSchema.ebookProductSnapshotRefundPolicies)
    .values(params)
    .returning();

  return refundPolicy;
};

export const createEbookProductSnapshotContent = async (
  params: IProductSnapshotContentCreate,
  db: TransactionClient,
): Promise<IProductSnapshotContent> => {
  const [content] = await db
    .insert(dbSchema.ebookProductSnapshotContents)
    .values(params)
    .returning();

  return content;
};

export const createEbookProductSnapshotPricing = async (
  params: IProductSnapshotPricingCreate,
  db: TransactionClient,
): Promise<IProductSnapshotPricing> => {
  const [pricing] = await db
    .insert(dbSchema.ebookProductSnapshotPricing)
    .values(params)
    .returning();

  return typia.assert<IProductSnapshotPricing>(pricing);
};

export const createEbookProductSnapshotDiscount = async (
  params: IProductSnapshotDiscountCreate,
  db: TransactionClient,
): Promise<IProductSnapshotDiscount> => {
  const [discount] = await db
    .insert(dbSchema.ebookProductSnapshotDiscounts)
    .values(params)
    .returning();

  return {
    ...discount,
    value: typia.assert<DiscountValue>(`${discount.value}`),
  };
};

export const createRandomEbookProduct = async (
  db: TransactionClient,
): Promise<IEbookProductWithRelations> => {
  const { ebook, ebookContents, user, userSession, teacher, category } =
    await createRandomEbook(db);
  const product = await createEbookProduct(
    {
      ...typia.random<IEbookProductCreate>(),
      ebookId: ebook.id,
    },
    db,
  );
  const snapshot = await createEbookProductSnapshot(
    {
      ...typia.random<IProductSnapshotCreate>(),
      productId: product.id,
    },
    db,
  );
  const announcement = await createEbookProductAnnouncement(
    {
      ...typia.random<IProductSnapshotContentCreate>(),
      productSnapshotId: snapshot.id,
    },
    db,
  );
  const refundPolicy = await createEbookProductSnapshotRefundPolicy(
    {
      ...typia.random<IProductSnapshotRefundPolicyCreate>(),
      productSnapshotId: snapshot.id,
    },
    db,
  );
  const content = await createEbookProductSnapshotContent(
    {
      ...typia.random<IProductSnapshotContentCreate>(),
      productSnapshotId: snapshot.id,
    },
    db,
  );
  const pricing = await createEbookProductSnapshotPricing(
    {
      ...typia.random<IProductSnapshotPricingCreate>(),
      productSnapshotId: snapshot.id,
    },
    db,
  );
  const discounts = await createEbookProductSnapshotDiscount(
    {
      ...typia.random<IProductSnapshotDiscountCreate>(),
      productSnapshotId: snapshot.id,
    },
    db,
  );

  return {
    ...product,
    ebook: {
      ...ebook,
      teacher: {
        ...teacher,
        account: user,
      },
      category,
      contents: ebookContents,
    },
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

export const seedEbookProducts = async (
  { count }: { count: number },
  db: TransactionClient,
) => {
  return await Promise.all(
    Array.from({ length: count }).map(() => createRandomEbookProduct(db)),
  );
};
