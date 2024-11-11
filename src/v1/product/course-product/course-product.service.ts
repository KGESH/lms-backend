import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  ICourseProduct,
  ICourseProductCreate,
} from '@src/v1/product/course-product/course-product.interface';
import { CourseProductRepository } from '@src/v1/product/course-product/course-product.repository';
import { CourseProductSnapshotPricingRepository } from '@src/v1/product/course-product/course-product-snapshot-pricing.repository';
import { CourseProductSnapshotDiscountRepository } from '@src/v1/product/course-product/course-product-snapshot-discount.repository';
import { CourseProductSnapshotRepository } from '@src/v1/product/course-product/course-product-snapshot.repository';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { CourseProductQueryRepository } from '@src/v1/product/course-product/course-product-query.repository';
import { IProductSnapshotCreate } from '@src/v1/product/common/snapshot/product-snapshot.interface';
import { IProductSnapshotPricingCreate } from '@src/v1/product/common/snapshot/pricing/product-snapshot-pricing.interface';
import { IProductSnapshotDiscountCreate } from '@src/v1/product/common/snapshot/discount/product-snapshot-discount.interface';
import {
  ICourseProductWithPricing,
  ICourseProductWithRelations,
} from '@src/v1/product/course-product/course-product-relations.interface';
import { Optional } from '@src/shared/types/optional';
import { CourseProductSnapshotContentRepository } from '@src/v1/product/course-product/course-product-snapshot-content.repository';
import { IProductSnapshotContentCreate } from '@src/v1/product/common/snapshot/content/product-snapshot-content.interface';
import { CourseProductSnapshotAnnouncementRepository } from '@src/v1/product/course-product/course-product-snapshot-announcement.repository';
import { CourseProductSnapshotRefundPolicyRepository } from '@src/v1/product/course-product/course-product-snapshot-refund-policy.repository';
import { IProductSnapshotAnnouncementCreate } from '@src/v1/product/common/snapshot/announcement/product-snapshot-announcement.interface';
import { IProductSnapshotRefundPolicyCreate } from '@src/v1/product/common/snapshot/refund-policy/product-snapshot-refund-policy.interface';
import { createUuid } from '@src/shared/utils/uuid';
import { Paginated, Pagination } from '@src/shared/types/pagination';
import { CourseQueryService } from '@src/v1/course/course-query.service';
import { CourseProductSnapshotUiContentRepository } from '@src/v1/product/course-product/course-product-snapshot-ui-content.repository';
import { IProductSnapshotUiContentCreate } from '@src/v1/product/common/snapshot/ui-content/product-snapshot-ui-content.interface';
import { IProductThumbnailCreate } from '@src/v1/product/common/snapshot/thumbnail/product-thumbnail.interface';
import { ProductThumbnailService } from '@src/v1/product/common/snapshot/thumbnail/product-thumbnail.service';
import { Uuid } from '@src/shared/types/primitive';
import { FileService } from '@src/v1/file/file.service';

@Injectable()
export class CourseProductService {
  constructor(
    private readonly courseProductRepository: CourseProductRepository,
    private readonly courseProductQueryRepository: CourseProductQueryRepository,
    private readonly courseProductSnapshotRepository: CourseProductSnapshotRepository,
    private readonly courseProductSnapshotPricingRepository: CourseProductSnapshotPricingRepository,
    private readonly courseProductSnapshotDiscountRepository: CourseProductSnapshotDiscountRepository,
    private readonly courseProductSnapshotContentRepository: CourseProductSnapshotContentRepository,
    private readonly courseProductSnapshotUiContentRepository: CourseProductSnapshotUiContentRepository,
    private readonly courseProductSnapshotAnnouncementRepository: CourseProductSnapshotAnnouncementRepository,
    private readonly courseProductSnapshotRefundPolicyRepository: CourseProductSnapshotRefundPolicyRepository,
    private readonly fileService: FileService,
    private readonly drizzle: DrizzleService,
  ) {}

  async findCourseProductsWithPricing(
    pagination: Pagination,
  ): Promise<Paginated<ICourseProductWithPricing[]>> {
    return await this.courseProductQueryRepository.findCourseProductsWithPricing(
      pagination,
    );
  }

  async findCourseProductWithPricingOrThrow(
    where: Pick<ICourseProduct, 'courseId'>,
  ): Promise<ICourseProductWithPricing> {
    const courseProduct =
      await this.courseProductQueryRepository.findCourseProductWithPricing(
        where,
      );

    if (!courseProduct) {
      throw new NotFoundException('Course product not found');
    }

    return courseProduct;
  }

  async findCourseProductWithRelations(
    where: Pick<ICourseProduct, 'courseId'>,
  ): Promise<ICourseProductWithRelations | null> {
    return await this.courseProductQueryRepository.findCourseProductWithRelations(
      where,
    );
  }

  async findCourseProductWithRelationsOrThrow(
    where: Pick<ICourseProduct, 'courseId'>,
  ): Promise<ICourseProductWithRelations> {
    const courseProduct = await this.findCourseProductWithRelations(where);

    if (!courseProduct?.lastSnapshot) {
      throw new NotFoundException('Course product snapshot not found');
    }

    return {
      ...courseProduct,
      lastSnapshot: courseProduct.lastSnapshot,
    };
  }

  async createCourseProduct({
    courseProductCreateParams,
    courseProductSnapshotCreateParams,
    courseProductSnapshotThumbnailCreateParams,
    courseProductSnapshotContentCreateParams,
    courseProductSnapshotAnnouncementCreateParams,
    courseProductSnapshotRefundPolicyCreateParams,
    courseProductSnapshotPricingCreateParams,
    courseProductSnapshotDiscountCreateParams,
    courseProductSnapshotUiContentCreateParams,
  }: {
    courseProductCreateParams: ICourseProductCreate;
    courseProductSnapshotCreateParams: Optional<
      IProductSnapshotCreate,
      'productId' | 'thumbnailId'
    >;
    courseProductSnapshotThumbnailCreateParams: IProductThumbnailCreate;
    courseProductSnapshotContentCreateParams: Optional<
      IProductSnapshotContentCreate,
      'productSnapshotId'
    >;
    courseProductSnapshotAnnouncementCreateParams: Optional<
      IProductSnapshotAnnouncementCreate,
      'productSnapshotId'
    >;
    courseProductSnapshotRefundPolicyCreateParams: Optional<
      IProductSnapshotRefundPolicyCreate,
      'productSnapshotId'
    >;
    courseProductSnapshotPricingCreateParams: Optional<
      IProductSnapshotPricingCreate,
      'productSnapshotId'
    >;
    courseProductSnapshotDiscountCreateParams: Optional<
      IProductSnapshotDiscountCreate,
      'productSnapshotId'
    >;
    courseProductSnapshotUiContentCreateParams: Optional<
      IProductSnapshotUiContentCreate,
      'productSnapshotId'
    >[];
  }): Promise<ICourseProductWithRelations> {
    const existProduct =
      await this.courseProductQueryRepository.findCourseProductWithRelations({
        courseId: courseProductCreateParams.courseId,
      });

    await this.drizzle.db.transaction(async (tx) => {
      const courseProduct =
        existProduct ??
        (await this.courseProductRepository.create(
          {
            ...courseProductCreateParams,
            id: createUuid(),
          },
          tx,
        ));
      // If thumbnail file updated, soft delete the prev file.
      if (
        existProduct?.lastSnapshot &&
        existProduct?.lastSnapshot.thumbnail.id !==
          courseProductSnapshotThumbnailCreateParams.id
      ) {
        await this.fileService.softDeleteManyFiles(
          [existProduct.lastSnapshot.thumbnail.id],
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
          courseProductSnapshotUiContentCreateParams
            .filter((ui) => ui.fileId)
            .map((ui) => ui.fileId) as Uuid[];
        const deleteFileIds = prevUiContentFileIds.filter(
          (id) => !updatedUiContentFileIds.includes(id),
        );
        if (deleteFileIds.length > 0) {
          await this.fileService.softDeleteManyFiles(deleteFileIds, tx);
        }
      }
      const snapshot = await this.courseProductSnapshotRepository.create(
        {
          ...courseProductSnapshotCreateParams,
          productId: courseProduct.id,
          thumbnailId: courseProductSnapshotThumbnailCreateParams.id,
          id: createUuid(),
        },
        tx,
      );
      const content = await this.courseProductSnapshotContentRepository.create({
        ...courseProductSnapshotContentCreateParams,
        productSnapshotId: snapshot.id,
        id: createUuid(),
      });
      const announcement =
        await this.courseProductSnapshotAnnouncementRepository.create({
          ...courseProductSnapshotAnnouncementCreateParams,
          productSnapshotId: snapshot.id,
          id: createUuid(),
        });
      const refundPolicy =
        await this.courseProductSnapshotRefundPolicyRepository.create({
          ...courseProductSnapshotRefundPolicyCreateParams,
          productSnapshotId: snapshot.id,
          id: createUuid(),
        });
      const pricing = await this.courseProductSnapshotPricingRepository.create({
        ...courseProductSnapshotPricingCreateParams,
        productSnapshotId: snapshot.id,
        id: createUuid(),
      });
      const discount =
        await this.courseProductSnapshotDiscountRepository.create({
          ...courseProductSnapshotDiscountCreateParams,
          productSnapshotId: snapshot.id,
          id: createUuid(),
        });
      const uiContents =
        courseProductSnapshotUiContentCreateParams.length > 0
          ? await this.courseProductSnapshotUiContentRepository.createMany(
              courseProductSnapshotUiContentCreateParams.map((params) => ({
                ...params,
                productSnapshotId: snapshot.id,
              })),
            )
          : [];

      return {
        ...courseProduct,
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

    const createdCourseProduct =
      await this.findCourseProductWithRelationsOrThrow({
        courseId: courseProductCreateParams.courseId,
      });

    return createdCourseProduct;
  }
}
