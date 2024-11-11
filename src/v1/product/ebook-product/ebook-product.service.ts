import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IEbookProduct,
  IEbookProductCreate,
} from '@src/v1/product/ebook-product/ebook-product.interface';
import { EbookProductRepository } from '@src/v1/product/ebook-product/ebook-product.repository';
import { EbookProductSnapshotPricingRepository } from '@src/v1/product/ebook-product/ebook-product-snapshot-pricing.repository';
import { EbookProductSnapshotDiscountRepository } from '@src/v1/product/ebook-product/ebook-product-snapshot-discount.repository';
import { EbookProductSnapshotRepository } from '@src/v1/product/ebook-product/ebook-product-snapshot.repository';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { EbookProductQueryRepository } from '@src/v1/product/ebook-product/ebook-product-query.repository';
import { IProductSnapshotCreate } from '@src/v1/product/common/snapshot/product-snapshot.interface';
import { IProductSnapshotPricingCreate } from '@src/v1/product/common/snapshot/pricing/product-snapshot-pricing.interface';
import { IProductSnapshotDiscountCreate } from '@src/v1/product/common/snapshot/discount/product-snapshot-discount.interface';
import {
  IEbookProductWithLastSnapshot,
  IEbookProductWithPricing,
  IEbookProductWithRelations,
} from '@src/v1/product/ebook-product/ebook-product-relations.interface';
import { Optional } from '@src/shared/types/optional';
import { EbookProductSnapshotContentRepository } from '@src/v1/product/ebook-product/ebook-product-snapshot-content.repository';
import { IProductSnapshotContentCreate } from '@src/v1/product/common/snapshot/content/product-snapshot-content.interface';
import { EbookProductSnapshotAnnouncementRepository } from '@src/v1/product/ebook-product/ebook-product-snapshot-announcement.repository';
import { EbookProductSnapshotRefundPolicyRepository } from '@src/v1/product/ebook-product/ebook-product-snapshot-refund-policy.repository';
import { IProductSnapshotAnnouncementCreate } from '@src/v1/product/common/snapshot/announcement/product-snapshot-announcement.interface';
import { IProductSnapshotRefundPolicyCreate } from '@src/v1/product/common/snapshot/refund-policy/product-snapshot-refund-policy.interface';
import { createUuid } from '@src/shared/utils/uuid';
import { Paginated, Pagination } from '@src/shared/types/pagination';
import { IProductSnapshotUiContentCreate } from '@src/v1/product/common/snapshot/ui-content/product-snapshot-ui-content.interface';
import { EbookProductSnapshotUiContentRepository } from '@src/v1/product/ebook-product/ebook-product-snapshot-ui-content.repository';
import { IProductThumbnailCreate } from '@src/v1/product/common/snapshot/thumbnail/product-thumbnail.interface';
import { ProductThumbnailService } from '@src/v1/product/common/snapshot/thumbnail/product-thumbnail.service';
import { EbookProductSnapshotTableOfContentRepository } from '@src/v1/product/ebook-product/ebook-product-snapshot-table-of-content.repository';
import { IEbookProductSnapshotTableOfContentCreate } from '@src/v1/product/ebook-product/snapshot/content/product-snapshot-content.interface';
import { EbookProductSnapshotPreviewRepository } from '@src/v1/product/ebook-product/ebook-product-snapshot-preview.repository';
import { IEbookProductSnapshotPreviewCreate } from '@src/v1/product/ebook-product/snapshot/preview/ebook-product-snapshot-preview.interface';
import { Uuid } from '@src/shared/types/primitive';
import { FileService } from '@src/v1/file/file.service';

@Injectable()
export class EbookProductService {
  constructor(
    private readonly productThumbnailService: ProductThumbnailService,
    private readonly ebookProductRepository: EbookProductRepository,
    private readonly ebookProductQueryRepository: EbookProductQueryRepository,
    private readonly ebookProductSnapshotRepository: EbookProductSnapshotRepository,
    private readonly ebookProductSnapshotPricingRepository: EbookProductSnapshotPricingRepository,
    private readonly ebookProductSnapshotDiscountRepository: EbookProductSnapshotDiscountRepository,
    private readonly ebookProductSnapshotContentRepository: EbookProductSnapshotContentRepository,
    private readonly ebookProductSnapshotTableOfContentRepository: EbookProductSnapshotTableOfContentRepository,
    private readonly ebookProductSnapshotPreviewRepository: EbookProductSnapshotPreviewRepository,
    private readonly ebookProductSnapshotUiContentRepository: EbookProductSnapshotUiContentRepository,
    private readonly ebookProductSnapshotAnnouncementRepository: EbookProductSnapshotAnnouncementRepository,
    private readonly ebookProductSnapshotRefundPolicyRepository: EbookProductSnapshotRefundPolicyRepository,
    private readonly fileService: FileService,
    private readonly drizzle: DrizzleService,
  ) {}

  async findEbookProductsWithPricing(
    pagination: Pagination,
  ): Promise<Paginated<IEbookProductWithPricing[]>> {
    return await this.ebookProductQueryRepository.findEbookProductsWithPricing(
      pagination,
    );
  }

  async findEbookProductWithPricingOrThrow(
    where: Pick<IEbookProduct, 'ebookId'>,
  ): Promise<IEbookProductWithPricing> {
    const ebookProduct =
      await this.ebookProductQueryRepository.findEbookProductWithPricing(where);

    if (!ebookProduct) {
      throw new NotFoundException('Ebook product not found');
    }

    return ebookProduct;
  }

  async findEbookProductWithRelations(
    where: Pick<IEbookProduct, 'ebookId'>,
  ): Promise<IEbookProductWithRelations | null> {
    return await this.ebookProductQueryRepository.findEbookProductWithRelations(
      where,
    );
  }

  async findEbookProductWithRelationsOrThrow(
    where: Pick<IEbookProduct, 'ebookId'>,
  ): Promise<IEbookProductWithRelations> {
    const ebookProduct = await this.findEbookProductWithRelations(where);

    if (!ebookProduct?.lastSnapshot) {
      throw new NotFoundException('Ebook product snapshot not found');
    }

    return {
      ...ebookProduct,
      lastSnapshot: ebookProduct.lastSnapshot,
    };
  }

  async findEbookProductOrThrow(
    where: Pick<IEbookProduct, 'ebookId'>,
  ): Promise<IEbookProductWithLastSnapshot> {
    const product =
      await this.ebookProductQueryRepository.findEbookProductWithLastSnapshot(
        where,
      );

    if (!product?.lastSnapshot) {
      throw new NotFoundException('Ebook product snapshot not found');
    }

    return {
      ...product,
      lastSnapshot: product.lastSnapshot,
    };
  }

  async createEbookProduct({
    ebookProductCreateParams,
    ebookProductSnapshotCreateParams,
    ebookProductSnapshotThumbnailCreateParams,
    ebookProductSnapshotContentCreateParams,
    ebookProductSnapshotTableOfContentParams,
    ebookProductSnapshotPreviewCreateParams,
    ebookProductSnapshotAnnouncementCreateParams,
    ebookProductSnapshotRefundPolicyCreateParams,
    ebookProductSnapshotPricingCreateParams,
    ebookProductSnapshotDiscountCreateParams,
    ebookProductSnapshotUiContentCreateParams,
  }: {
    ebookProductCreateParams: IEbookProductCreate;
    ebookProductSnapshotCreateParams: Optional<
      IProductSnapshotCreate,
      'productId' | 'thumbnailId'
    >;
    ebookProductSnapshotThumbnailCreateParams: IProductThumbnailCreate;
    ebookProductSnapshotContentCreateParams: Optional<
      IProductSnapshotContentCreate,
      'productSnapshotId'
    >;
    ebookProductSnapshotTableOfContentParams: Optional<
      IEbookProductSnapshotTableOfContentCreate,
      'productSnapshotId'
    >;
    ebookProductSnapshotPreviewCreateParams: Optional<
      IEbookProductSnapshotPreviewCreate,
      'productSnapshotId'
    >;
    ebookProductSnapshotAnnouncementCreateParams: Optional<
      IProductSnapshotAnnouncementCreate,
      'productSnapshotId'
    >;
    ebookProductSnapshotRefundPolicyCreateParams: Optional<
      IProductSnapshotRefundPolicyCreate,
      'productSnapshotId'
    >;
    ebookProductSnapshotPricingCreateParams: Optional<
      IProductSnapshotPricingCreate,
      'productSnapshotId'
    >;
    ebookProductSnapshotDiscountCreateParams: Optional<
      IProductSnapshotDiscountCreate,
      'productSnapshotId'
    >;
    ebookProductSnapshotUiContentCreateParams: Optional<
      IProductSnapshotUiContentCreate,
      'productSnapshotId'
    >[];
  }): Promise<IEbookProductWithRelations> {
    if (
      ebookProductSnapshotThumbnailCreateParams.id ===
      ebookProductSnapshotPreviewCreateParams.fileId
    ) {
      throw new BadRequestException(
        'Thumbnail and preview cannot be the same file',
      );
    }

    const existProduct =
      await this.ebookProductQueryRepository.findEbookProductWithRelations({
        ebookId: ebookProductCreateParams.ebookId,
      });

    await this.drizzle.db.transaction(async (tx) => {
      const ebookProduct =
        existProduct ??
        (await this.ebookProductRepository.create(
          {
            ...ebookProductCreateParams,
            id: createUuid(),
          },
          tx,
        ));
      // If thumbnail file updated, soft delete the prev thumbnail file.
      if (
        existProduct?.lastSnapshot &&
        existProduct?.lastSnapshot.thumbnail.id !==
          ebookProductSnapshotThumbnailCreateParams.id
      ) {
        await this.ebookProductSnapshotRepository.softDeleteThumbnailFile(
          { thumbnailId: existProduct.lastSnapshot.thumbnail.id },
          tx,
        );
      }
      // If ui content file updated, soft delete the prev files.
      if (
        existProduct?.lastSnapshot &&
        existProduct?.lastSnapshot.uiContents.length > 0
      ) {
        const prevUiContentFileIds = existProduct.lastSnapshot.uiContents
          .filter((ui) => ui.fileId)
          .map((ui) => ui.fileId) as Uuid[];
        const updatedUiContentFileIds =
          ebookProductSnapshotUiContentCreateParams
            .filter((ui) => ui.fileId)
            .map((ui) => ui.fileId) as Uuid[];
        const deleteFileIds = prevUiContentFileIds.filter(
          (id) => !updatedUiContentFileIds.includes(id),
        );
        if (deleteFileIds.length > 0) {
          await this.fileService.softDeleteManyFiles(deleteFileIds, tx);
        }
      }
      const snapshot = await this.ebookProductSnapshotRepository.create(
        {
          ...ebookProductSnapshotCreateParams,
          productId: ebookProduct.id,
          thumbnailId: ebookProductSnapshotThumbnailCreateParams.id,
          id: createUuid(),
        },
        tx,
      );
      const content = await this.ebookProductSnapshotContentRepository.create(
        {
          ...ebookProductSnapshotContentCreateParams,
          productSnapshotId: snapshot.id,
          id: createUuid(),
        },
        tx,
      );
      const tableOfContent =
        await this.ebookProductSnapshotTableOfContentRepository.create(
          {
            ...ebookProductSnapshotTableOfContentParams,
            productSnapshotId: snapshot.id,
            id: createUuid(),
          },
          tx,
        );
      // If preview file updated, soft delete the prev preview file.
      if (
        existProduct?.lastSnapshot &&
        existProduct?.lastSnapshot.preview.fileId !==
          ebookProductSnapshotPreviewCreateParams.fileId
      ) {
        await this.ebookProductSnapshotPreviewRepository.softDeletePreviewFile(
          { fileId: existProduct.lastSnapshot.preview.fileId },
          tx,
        );
      }
      const preview = await this.ebookProductSnapshotPreviewRepository.create(
        {
          ...ebookProductSnapshotPreviewCreateParams,
          productSnapshotId: snapshot.id,
          id: createUuid(),
        },
        tx,
      );
      const announcement =
        await this.ebookProductSnapshotAnnouncementRepository.create(
          {
            ...ebookProductSnapshotAnnouncementCreateParams,
            productSnapshotId: snapshot.id,
            id: createUuid(),
          },
          tx,
        );
      const refundPolicy =
        await this.ebookProductSnapshotRefundPolicyRepository.create(
          {
            ...ebookProductSnapshotRefundPolicyCreateParams,
            productSnapshotId: snapshot.id,
            id: createUuid(),
          },
          tx,
        );
      const pricing = await this.ebookProductSnapshotPricingRepository.create(
        {
          ...ebookProductSnapshotPricingCreateParams,
          productSnapshotId: snapshot.id,
          id: createUuid(),
        },
        tx,
      );
      const discount = await this.ebookProductSnapshotDiscountRepository.create(
        {
          ...ebookProductSnapshotDiscountCreateParams,
          productSnapshotId: snapshot.id,
          id: createUuid(),
        },
        tx,
      );
      const uiContents =
        ebookProductSnapshotUiContentCreateParams.length > 0
          ? await this.ebookProductSnapshotUiContentRepository.createMany(
              ebookProductSnapshotUiContentCreateParams.map((params) => ({
                ...params,
                productSnapshotId: snapshot.id,
              })),
              tx,
            )
          : [];

      return {
        ...ebookProduct,
        lastSnapshot: {
          ...snapshot,
          announcement,
          content,
          tableOfContent,
          preview,
          refundPolicy,
          pricing,
          discount,
          uiContents,
        },
      };
    });

    const createdEbookProduct = await this.findEbookProductWithRelationsOrThrow(
      {
        ebookId: ebookProductCreateParams.ebookId,
      },
    );

    return createdEbookProduct;
  }
}
