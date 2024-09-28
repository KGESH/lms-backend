import { Injectable, NotFoundException } from '@nestjs/common';
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
import { IProductSnapshotCreate } from '@src/v1/product/common/snapshot/conrse-product-snapshot.interface';
import { IProductSnapshotPricingCreate } from '@src/v1/product/common/snapshot/pricing/product-snapshot-pricing.interface';
import { IProductSnapshotDiscountCreate } from '@src/v1/product/common/snapshot/discount/product-snapshot-discount.interface';
import {
  IEbookProductWithLastSnapshot,
  IEbookProductWithPricing,
  IEbookProductWithRelations,
} from '@src/v1/product/ebook-product/ebook-product-relations.interface';
import { NonNullableInfer } from '@src/shared/types/non-nullable-infer';
import { Optional } from '@src/shared/types/optional';
import { EbookProductSnapshotContentRepository } from '@src/v1/product/ebook-product/ebook-product-snapshot-content.repository';
import { IProductSnapshotContentCreate } from '@src/v1/product/common/snapshot/content/product-snapshot-content.interface';
import { EbookProductSnapshotAnnouncementRepository } from '@src/v1/product/ebook-product/ebook-product-snapshot-announcement.repository';
import { EbookProductSnapshotRefundPolicyRepository } from '@src/v1/product/ebook-product/ebook-product-snapshot-refund-policy.repository';
import { IProductSnapshotAnnouncementCreate } from '@src/v1/product/common/snapshot/announcement/product-snapshot-announcement.interface';
import { IProductSnapshotRefundPolicyCreate } from '@src/v1/product/common/snapshot/refund-policy/product-snapshot-refund-policy.interface';
import { createUuid } from '@src/shared/utils/uuid';
import { Paginated, Pagination } from '@src/shared/types/pagination';
import {
  IProductSnapshotUiContentCreate,
  IProductSnapshotUiContentUpdate,
} from '@src/v1/product/common/snapshot/ui-content/product-snapshot-ui-content.interface';
import { EbookProductSnapshotUiContentRepository } from '@src/v1/product/ebook-product/ebook-product-snapshot-ui-content.repository';
import { IProductThumbnailCreate } from '@src/v1/product/common/snapshot/thumbnail/product-thumbnail.interface';
import { ProductThumbnailService } from '@src/v1/product/common/snapshot/thumbnail/product-thumbnail.service';

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
    private readonly ebookProductSnapshotUiContentRepository: EbookProductSnapshotUiContentRepository,
    private readonly ebookProductSnapshotAnnouncementRepository: EbookProductSnapshotAnnouncementRepository,
    private readonly ebookProductSnapshotRefundPolicyRepository: EbookProductSnapshotRefundPolicyRepository,
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
  ): Promise<NonNullableInfer<IEbookProductWithRelations>> {
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
  ): Promise<NonNullableInfer<IEbookProductWithLastSnapshot>> {
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
  }): Promise<NonNullableInfer<IEbookProductWithRelations>> {
    const existProduct =
      await this.ebookProductQueryRepository.findEbookProductWithLastSnapshot({
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
      const snapshot = await this.ebookProductSnapshotRepository.create(
        {
          ...ebookProductSnapshotCreateParams,
          productId: ebookProduct.id,
          thumbnailId: ebookProductSnapshotThumbnailCreateParams.id,
          id: createUuid(),
        },
        tx,
      );
      const content = await this.ebookProductSnapshotContentRepository.create({
        ...ebookProductSnapshotContentCreateParams,
        productSnapshotId: snapshot.id,
        id: createUuid(),
      });
      const announcement =
        await this.ebookProductSnapshotAnnouncementRepository.create({
          ...ebookProductSnapshotAnnouncementCreateParams,
          productSnapshotId: snapshot.id,
          id: createUuid(),
        });
      const refundPolicy =
        await this.ebookProductSnapshotRefundPolicyRepository.create({
          ...ebookProductSnapshotRefundPolicyCreateParams,
          productSnapshotId: snapshot.id,
          id: createUuid(),
        });
      const pricing = await this.ebookProductSnapshotPricingRepository.create({
        ...ebookProductSnapshotPricingCreateParams,
        productSnapshotId: snapshot.id,
        id: createUuid(),
      });
      const discount = await this.ebookProductSnapshotDiscountRepository.create(
        {
          ...ebookProductSnapshotDiscountCreateParams,
          productSnapshotId: snapshot.id,
          id: createUuid(),
        },
      );
      const uiContents =
        ebookProductSnapshotUiContentCreateParams.length > 0
          ? await this.ebookProductSnapshotUiContentRepository.createMany(
              ebookProductSnapshotUiContentCreateParams.map((params) => ({
                ...params,
                productSnapshotId: snapshot.id,
              })),
            )
          : [];

      return {
        ...ebookProduct,
        lastSnapshot: {
          ...snapshot,
          announcement,
          content,
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

  async updateEbookProduct(
    where: Pick<IEbookProduct, 'ebookId'>,
    {
      ebookProductSnapshotUpdateParams,
      ebookProductSnapshotThumbnailUpdateParams,
      ebookProductSnapshotContentUpdateParams,
      ebookProductSnapshotAnnouncementUpdateParams,
      ebookProductSnapshotRefundPolicyUpdateParams,
      ebookProductSnapshotPricingUpdateParams,
      ebookProductSnapshotDiscountUpdateParams,
      ebookProductSnapshotUiContentParams,
    }: {
      ebookProductSnapshotUpdateParams?: Omit<
        IProductSnapshotCreate,
        'productId' | 'thumbnailId'
      >;
      ebookProductSnapshotThumbnailUpdateParams?: IProductThumbnailCreate;
      ebookProductSnapshotContentUpdateParams?: Pick<
        IProductSnapshotContentCreate,
        'richTextContent'
      >;
      ebookProductSnapshotAnnouncementUpdateParams?: Pick<
        IProductSnapshotAnnouncementCreate,
        'richTextContent'
      >;
      ebookProductSnapshotRefundPolicyUpdateParams?: Pick<
        IProductSnapshotRefundPolicyCreate,
        'richTextContent'
      >;
      ebookProductSnapshotPricingUpdateParams?: Pick<
        IProductSnapshotPricingCreate,
        'amount'
      >;
      ebookProductSnapshotDiscountUpdateParams?: Omit<
        IProductSnapshotDiscountCreate,
        'productSnapshotId'
      >;
      ebookProductSnapshotUiContentParams: {
        create: Omit<IProductSnapshotUiContentCreate, 'productSnapshotId'>[];
        update: IProductSnapshotUiContentUpdate[];
      };
    },
  ): Promise<NonNullableInfer<IEbookProductWithRelations>> {
    const existProduct = await this.findEbookProductWithRelationsOrThrow(where);

    // Create new snapshot using the given parameters.
    // If the parameter is not given, use the existing snapshot. e.g. pricing create params.
    const updatedProduct = await this.drizzle.db.transaction(async (tx) => {
      // soft delete
      if (ebookProductSnapshotThumbnailUpdateParams) {
        await this.productThumbnailService.deleteProductThumbnail(
          {
            id: existProduct.lastSnapshot.thumbnail.id,
          },
          tx,
        );
      }

      const snapshot = await this.ebookProductSnapshotRepository.create(
        {
          productId: existProduct.id,
          thumbnailId:
            ebookProductSnapshotThumbnailUpdateParams?.id ??
            existProduct.lastSnapshot.thumbnail.id,
          id: createUuid(),
          ...(ebookProductSnapshotUpdateParams ?? {
            title: existProduct.lastSnapshot.title,
            description: existProduct.lastSnapshot.description,
          }),
        },
        tx,
      );
      const content = await this.ebookProductSnapshotContentRepository.create(
        {
          ...existProduct.lastSnapshot.content,
          ...ebookProductSnapshotContentUpdateParams,
          productSnapshotId: snapshot.id,
          id: createUuid(),
        },
        tx,
      );
      const announcement =
        await this.ebookProductSnapshotAnnouncementRepository.create(
          {
            ...existProduct.lastSnapshot.announcement,
            ...ebookProductSnapshotAnnouncementUpdateParams,
            productSnapshotId: snapshot.id,
            id: createUuid(),
          },
          tx,
        );
      const refundPolicy =
        await this.ebookProductSnapshotRefundPolicyRepository.create(
          {
            ...existProduct.lastSnapshot.refundPolicy,
            ...ebookProductSnapshotRefundPolicyUpdateParams,
            productSnapshotId: snapshot.id,
            id: createUuid(),
          },
          tx,
        );
      const pricing = await this.ebookProductSnapshotPricingRepository.create({
        ...existProduct.lastSnapshot.pricing,
        ...ebookProductSnapshotPricingUpdateParams,
        productSnapshotId: snapshot.id,
        id: createUuid(),
      });
      const discount = await this.ebookProductSnapshotDiscountRepository.create(
        {
          ...existProduct.lastSnapshot.discount,
          ...ebookProductSnapshotDiscountUpdateParams,
          productSnapshotId: snapshot.id,
          id: createUuid(),
        },
      );

      const existUi = existProduct.lastSnapshot.uiContents;
      const createUiParams: IProductSnapshotUiContentCreate[] =
        ebookProductSnapshotUiContentParams?.create.map((params) => ({
          ...params,
          productSnapshotId: snapshot.id,
          id: createUuid(),
        })) ?? [];
      const updateUiParams = ebookProductSnapshotUiContentParams?.update ?? [];
      const updateUiIds = updateUiParams.map((ui) => ui.id);
      const existSameUiParams = existUi
        .filter((ui) => !updateUiIds.includes(ui.id))
        .map((ui) => ({
          ...ui,
          id: createUuid(),
        }));
      const updatedUiParams = existUi
        .filter((ui) => updateUiIds.includes(ui.id))
        .map((ui) => {
          const updateTarget = updateUiParams.find(
            (updateUi) => updateUi.id === ui.id,
          );
          return {
            type: updateTarget?.type ?? ui.type,
            content: updateTarget?.content ?? ui.content,
            description: updateTarget?.description ?? ui.description,
            sequence: updateTarget?.sequence ?? ui.sequence,
            url: updateTarget?.url ?? ui.url,
            metadata: updateTarget?.metadata ?? ui.metadata,
            productSnapshotId: snapshot.id,
            id: createUuid(),
          };
        });
      const uiContentCreateParams = [
        ...existSameUiParams,
        ...updatedUiParams,
        ...createUiParams,
      ];
      const uiContents =
        uiContentCreateParams.length > 0
          ? await this.ebookProductSnapshotUiContentRepository.createMany(
              uiContentCreateParams,
              tx,
            )
          : [];

      return {
        ...existProduct,
        lastSnapshot: {
          ...snapshot,
          announcement,
          content,
          refundPolicy,
          pricing,
          discount,
          uiContents,
        },
      };
    });

    const thumbnail =
      await this.productThumbnailService.findProductThumbnailOrThrow({
        id: updatedProduct.lastSnapshot.thumbnailId,
      });

    return {
      ...updatedProduct,
      lastSnapshot: {
        ...updatedProduct.lastSnapshot,
        thumbnail,
      },
    };
  }
}
