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
import {
  generateRandomDiscount,
  generateRandomPrice,
} from '../../../../../src/shared/helpers/mocks/random-price.mock';
import * as date from '../../../../../src/shared/utils/date';
import {
  IProductSnapshotUiContent,
  IProductSnapshotUiContentCreate,
} from '@src/v1/product/common/snapshot/ui-content/product-snapshot-ui-content.interface';

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

export const createEbookProductSnapshotUiContent = async (
  params: IProductSnapshotUiContentCreate[],
  db: TransactionClient,
): Promise<IProductSnapshotUiContent[]> => {
  if (params.length === 0) {
    return [];
  }

  const uiContents = await db
    .insert(dbSchema.ebookProductSnapshotUiContents)
    .values(params)
    .returning();

  return uiContents;
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
      title: '테스트 온라인 전자책',
      description: '테스트 온라인 전자책 상품입니다.',
    },
    db,
  );
  const announcement = await createEbookProductAnnouncement(
    {
      productSnapshotId: snapshot.id,
      richTextContent: '테스트 공지사항입니다.',
    },
    db,
  );
  const refundPolicy = await createEbookProductSnapshotRefundPolicy(
    {
      productSnapshotId: snapshot.id,
      richTextContent: '테스트 환불 정책입니다.',
    },
    db,
  );
  const content = await createEbookProductSnapshotContent(
    {
      productSnapshotId: snapshot.id,
      richTextContent: '테스트 전자책 상품 설명입니다.',
    },
    db,
  );
  const pricing = await createEbookProductSnapshotPricing(
    {
      productSnapshotId: snapshot.id,
      amount: generateRandomPrice(),
    },
    db,
  );
  const discounts = await createEbookProductSnapshotDiscount(
    {
      ...generateRandomDiscount(),
      productSnapshotId: snapshot.id,
      validFrom: date.now('date'),
      validTo: date.addDate(date.now('date'), 1, 'month', 'date'),
    },
    db,
  );
  const uiContents = await createEbookProductSnapshotUiContent(
    typia.random<IProductSnapshotUiContentCreate[]>().map((params) => ({
      ...params,
      productSnapshotId: snapshot.id,
    })),
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
      uiContents,
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
