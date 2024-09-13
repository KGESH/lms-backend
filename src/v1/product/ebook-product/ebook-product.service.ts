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

@Injectable()
export class EbookProductService {
  constructor(
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
    return await this.ebookProductQueryRepository.findEbookProductsWithRelations(
      pagination,
    );
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
      'productId'
    >;
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
    > | null;
    ebookProductSnapshotUiContentCreateParams: Optional<
      IProductSnapshotUiContentCreate,
      'productSnapshotId'
    >[];
  }): Promise<NonNullableInfer<IEbookProductWithRelations>> {
    const existProduct =
      await this.ebookProductQueryRepository.findEbookProductWithLastSnapshot({
        ebookId: ebookProductCreateParams.ebookId,
      });

    const product: NonNullableInfer<Omit<IEbookProductWithRelations, 'ebook'>> =
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
        );
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
        const pricing = await this.ebookProductSnapshotPricingRepository.create(
          {
            ...ebookProductSnapshotPricingCreateParams,
            productSnapshotId: snapshot.id,
            id: createUuid(),
          },
        );
        const discount = ebookProductSnapshotDiscountCreateParams
          ? await this.ebookProductSnapshotDiscountRepository.create({
              ...ebookProductSnapshotDiscountCreateParams,
              productSnapshotId: snapshot.id,
              id: createUuid(),
            })
          : null;
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
            discounts: discount,
            uiContents,
          },
        } satisfies NonNullableInfer<Omit<IEbookProductWithRelations, 'ebook'>>;
      });

    if (existProduct) {
      return {
        ...product,
        ebook: existProduct.ebook,
      };
    }

    const createdEbookProduct =
      await this.ebookProductQueryRepository.findEbookProductWithLastSnapshotOrThrow(
        {
          ebookId: ebookProductCreateParams.ebookId,
        },
      );

    return {
      ...product,
      ebook: createdEbookProduct.ebook,
    };
  }

  async updateEbookProduct(
    where: Pick<IEbookProduct, 'ebookId'>,
    {
      ebookProductSnapshotCreateParams,
      ebookProductSnapshotContentCreateParams,
      ebookProductSnapshotAnnouncementCreateParams,
      ebookProductSnapshotRefundPolicyCreateParams,
      ebookProductSnapshotPricingCreateParams,
      ebookProductSnapshotDiscountCreateParams,
      ebookProductSnapshotUiContentParams,
    }: {
      ebookProductSnapshotCreateParams?: Partial<
        Omit<IProductSnapshotCreate, 'productId'>
      >;
      ebookProductSnapshotContentCreateParams?: Pick<
        IProductSnapshotContentCreate,
        'richTextContent'
      >;
      ebookProductSnapshotAnnouncementCreateParams?: Pick<
        IProductSnapshotAnnouncementCreate,
        'richTextContent'
      >;
      ebookProductSnapshotRefundPolicyCreateParams?: Pick<
        IProductSnapshotRefundPolicyCreate,
        'richTextContent'
      >;
      ebookProductSnapshotPricingCreateParams?: Pick<
        IProductSnapshotPricingCreate,
        'amount'
      >;
      ebookProductSnapshotDiscountCreateParams?: Omit<
        IProductSnapshotDiscountCreate,
        'productSnapshotId'
      > | null;
      ebookProductSnapshotUiContentParams: {
        create: Omit<IProductSnapshotUiContentCreate, 'productSnapshotId'>[];
        update: IProductSnapshotUiContentUpdate[];
      };
    },
  ): Promise<NonNullableInfer<IEbookProductWithRelations>> {
    const existProduct = await this.findEbookProductWithRelationsOrThrow(where);

    // Create new snapshot using the given parameters.
    // If the parameter is not given, use the existing snapshot. e.g. pricing create params.
    const updatedProduct: NonNullableInfer<IEbookProductWithRelations> =
      await this.drizzle.db.transaction(async (tx) => {
        const snapshot = await this.ebookProductSnapshotRepository.create(
          {
            ...existProduct.lastSnapshot,
            ...ebookProductSnapshotCreateParams,
            productId: existProduct.id,
            id: createUuid(),
          },
          tx,
        );
        const content = await this.ebookProductSnapshotContentRepository.create(
          {
            ...existProduct.lastSnapshot.content,
            ...ebookProductSnapshotContentCreateParams,
            productSnapshotId: snapshot.id,
            id: createUuid(),
          },
          tx,
        );
        const announcement =
          await this.ebookProductSnapshotAnnouncementRepository.create(
            {
              ...existProduct.lastSnapshot.announcement,
              ...ebookProductSnapshotAnnouncementCreateParams,
              productSnapshotId: snapshot.id,
              id: createUuid(),
            },
            tx,
          );
        const refundPolicy =
          await this.ebookProductSnapshotRefundPolicyRepository.create(
            {
              ...existProduct.lastSnapshot.refundPolicy,
              ...ebookProductSnapshotRefundPolicyCreateParams,
              productSnapshotId: snapshot.id,
              id: createUuid(),
            },
            tx,
          );
        const pricing = await this.ebookProductSnapshotPricingRepository.create(
          {
            ...existProduct.lastSnapshot.pricing,
            ...ebookProductSnapshotPricingCreateParams,
            productSnapshotId: snapshot.id,
            id: createUuid(),
          },
        );
        const discount = existProduct.lastSnapshot.discounts
          ? await this.ebookProductSnapshotDiscountRepository.create({
              ...existProduct.lastSnapshot.discounts,
              ...ebookProductSnapshotDiscountCreateParams,
              productSnapshotId: snapshot.id,
              id: createUuid(),
            })
          : ebookProductSnapshotDiscountCreateParams
            ? await this.ebookProductSnapshotDiscountRepository.create({
                ...ebookProductSnapshotDiscountCreateParams,
                productSnapshotId: snapshot.id,
                id: createUuid(),
              })
            : null;

        const existUi = existProduct.lastSnapshot.uiContents;
        const createUiParams: IProductSnapshotUiContentCreate[] =
          ebookProductSnapshotUiContentParams?.create.map((params) => ({
            ...params,
            productSnapshotId: snapshot.id,
            id: createUuid(),
          })) ?? [];
        const updateUiParams =
          ebookProductSnapshotUiContentParams?.update ?? [];
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
            discounts: discount,
            uiContents,
          },
        } satisfies NonNullableInfer<IEbookProductWithRelations>;
      });

    return updatedProduct;
  }
}
