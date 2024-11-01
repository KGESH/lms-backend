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
} from '@src/v1/product/common/snapshot/product-snapshot.interface';
import {
  IProductSnapshotPricing,
  IProductSnapshotPricingCreate,
} from '../../../../../src/v1/product/common/snapshot/pricing/product-snapshot-pricing.interface';
import {
  IProductSnapshotDiscount,
  IProductSnapshotDiscountCreate,
} from '../../../../../src/v1/product/common/snapshot/discount/product-snapshot-discount.interface';
import { IEbookProductWithRelations } from '../../../../../src/v1/product/ebook-product/ebook-product-relations.interface';
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
import * as date from '../../../../../src/shared/utils/date';
import {
  IProductSnapshotUiContent,
  IProductSnapshotUiContentCreate,
} from '../../../../../src/v1/product/common/snapshot/ui-content/product-snapshot-ui-content.interface';
import { createManyFiles } from './file.helper';
import { IProductThumbnail } from '../../../../../src/v1/product/common/snapshot/thumbnail/product-thumbnail.interface';
import { IFileCreate } from '@src/v1/file/file.interface';
import {
  IEbookProductSnapshotTableOfContent,
  IEbookProductSnapshotTableOfContentCreate,
} from '@src/v1/product/ebook-product/snapshot/content/product-snapshot-content.interface';
import {
  IEbookProductSnapshotPreview,
  IEbookProductSnapshotPreviewCreate,
} from '@src/v1/product/ebook-product/snapshot/preview/ebook-product-snapshot-preview.interface';

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

export const createEbookProductThumbnail = async (
  params: IFileCreate,
  db: TransactionClient,
): Promise<IProductThumbnail> => {
  const [thumbnail] = await createManyFiles([params], db);
  return typia.assert<IProductThumbnail>(thumbnail);
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

export const createEbookProductSnapshotTableOfContent = async (
  params: IEbookProductSnapshotTableOfContentCreate,
  db: TransactionClient,
): Promise<IEbookProductSnapshotTableOfContent> => {
  const [content] = await db
    .insert(dbSchema.ebookProductSnapshotTableOfContents)
    .values(params)
    .returning();

  return content;
};

export const createEbookProductSnapshotPreview = async (
  params: IEbookProductSnapshotPreviewCreate,
  db: TransactionClient,
): Promise<IEbookProductSnapshotPreview> => {
  const [content] = await db
    .insert(dbSchema.ebookProductSnapshotPreviews)
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
  const [mockUploadedPreviewFile] = await createManyFiles(
    [
      {
        id: typia.random<Uuid>(),
        filename: 'mock-preview.png',
        metadata: null,
        type: 'image',
        url: 'https://aceternity.com/images/products/previews/new/editrix.png',
      },
    ],
    db,
  );
  const thumbnail = await createEbookProductThumbnail(
    {
      id: typia.random<Uuid>(),
      metadata: null,
      filename: 'thumbnail.png',
      type: 'image',
      url: 'https://aceternity.com/images/products/thumbnails/new/editrix.png',
    },
    db,
  );
  const snapshot = await createEbookProductSnapshot(
    {
      ...typia.random<IProductSnapshotCreate>(),
      thumbnailId: thumbnail.id,
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
  const tableOfContent = await createEbookProductSnapshotTableOfContent(
    {
      productSnapshotId: snapshot.id,
      richTextContent: '테스트 전자책 목차입니다.',
    },
    db,
  );
  const preview = await createEbookProductSnapshotPreview(
    {
      productSnapshotId: snapshot.id,
      fileId: mockUploadedPreviewFile.id,
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
  const discount = await createEbookProductSnapshotDiscount(
    {
      ...generateRandomDiscount(),
      enabled: true,
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
      thumbnail,
      announcement,
      refundPolicy,
      content,
      tableOfContent,
      preview,
      pricing,
      discount,
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
