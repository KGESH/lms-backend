import { Injectable, NotFoundException } from '@nestjs/common';
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
import { IProductSnapshotCreate } from '@src/v1/product/common/snapshot/conrse-product-snapshot.interface';
import { IProductSnapshotPricingCreate } from '@src/v1/product/common/snapshot/pricing/product-snapshot-pricing.interface';
import { IProductSnapshotDiscountCreate } from '@src/v1/product/common/snapshot/discount/product-snapshot-discount.interface';
import {
  ICourseProductWithLastSnapshot,
  ICourseProductWithPricing,
  ICourseProductWithRelations,
} from '@src/v1/product/course-product/course-product-relations.interface';
import { NonNullableInfer } from '@src/shared/types/non-nullable-infer';
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
import {
  IProductSnapshotUiContentCreate,
  IProductSnapshotUiContentUpdate,
} from '@src/v1/product/common/snapshot/ui-content/product-snapshot-ui-content.interface';

@Injectable()
export class CourseProductService {
  constructor(
    private readonly courseQueryService: CourseQueryService,
    private readonly courseProductRepository: CourseProductRepository,
    private readonly courseProductQueryRepository: CourseProductQueryRepository,
    private readonly courseProductSnapshotRepository: CourseProductSnapshotRepository,
    private readonly courseProductSnapshotPricingRepository: CourseProductSnapshotPricingRepository,
    private readonly courseProductSnapshotDiscountRepository: CourseProductSnapshotDiscountRepository,
    private readonly courseProductSnapshotContentRepository: CourseProductSnapshotContentRepository,
    private readonly courseProductSnapshotUiContentRepository: CourseProductSnapshotUiContentRepository,
    private readonly courseProductSnapshotAnnouncementRepository: CourseProductSnapshotAnnouncementRepository,
    private readonly courseProductSnapshotRefundPolicyRepository: CourseProductSnapshotRefundPolicyRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async findCourseProductsWithPricing(
    pagination: Pagination,
  ): Promise<Paginated<ICourseProductWithPricing[]>> {
    return await this.courseProductQueryRepository.findCourseProductsWithRelations(
      pagination,
    );
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
  ): Promise<NonNullableInfer<ICourseProductWithRelations>> {
    const courseProduct = await this.findCourseProductWithRelations(where);

    if (!courseProduct?.lastSnapshot) {
      throw new NotFoundException('Course product snapshot not found');
    }

    return {
      ...courseProduct,
      lastSnapshot: courseProduct.lastSnapshot,
    };
  }

  async findCourseProductOrThrow(
    where: Pick<ICourseProduct, 'courseId'>,
  ): Promise<NonNullableInfer<ICourseProductWithLastSnapshot>> {
    const product =
      await this.courseProductQueryRepository.findCourseProductWithLastSnapshot(
        where,
      );

    if (!product?.lastSnapshot) {
      throw new NotFoundException('Course product snapshot not found');
    }

    return {
      ...product,
      lastSnapshot: product.lastSnapshot,
    };
  }

  async createCourseProduct({
    courseProductCreateParams,
    courseProductSnapshotCreateParams,
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
      'productId'
    >;
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
    > | null;
    courseProductSnapshotUiContentCreateParams: Optional<
      IProductSnapshotUiContentCreate,
      'productSnapshotId'
    >[];
  }): Promise<NonNullableInfer<ICourseProductWithRelations>> {
    const course = await this.courseQueryService.findCourseByIdOrThrow({
      id: courseProductCreateParams.courseId,
    });

    const existProduct =
      await this.courseProductQueryRepository.findCourseProductWithLastSnapshot(
        {
          courseId: course.id,
        },
      );

    const product: NonNullableInfer<
      Omit<ICourseProductWithRelations, 'course'>
    > = await this.drizzle.db.transaction(async (tx) => {
      const courseProduct =
        existProduct ??
        (await this.courseProductRepository.create(
          {
            ...courseProductCreateParams,
            id: createUuid(),
          },
          tx,
        ));
      const snapshot = await this.courseProductSnapshotRepository.create(
        {
          ...courseProductSnapshotCreateParams,
          productId: courseProduct.id,
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
      const discount = courseProductSnapshotDiscountCreateParams
        ? await this.courseProductSnapshotDiscountRepository.create({
            ...courseProductSnapshotDiscountCreateParams,
            productSnapshotId: snapshot.id,
            id: createUuid(),
          })
        : null;
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
          discounts: discount,
          uiContents,
        },
      } satisfies NonNullableInfer<Omit<ICourseProductWithRelations, 'course'>>;
    });

    if (existProduct) {
      return {
        ...product,
        course: existProduct.course,
      };
    }

    const createdCourseProduct =
      await this.courseProductQueryRepository.findCourseProductWithLastSnapshotOrThrow(
        {
          courseId: course.id,
        },
      );

    return {
      ...product,
      course: createdCourseProduct.course,
    };
  }

  async updateCourseProduct(
    where: Pick<ICourseProduct, 'courseId'>,
    {
      courseProductSnapshotCreateParams,
      courseProductSnapshotContentCreateParams,
      courseProductSnapshotAnnouncementCreateParams,
      courseProductSnapshotRefundPolicyCreateParams,
      courseProductSnapshotPricingCreateParams,
      courseProductSnapshotDiscountCreateParams,
      courseProductSnapshotUiContentParams,
    }: {
      courseProductSnapshotCreateParams?: Partial<
        Omit<IProductSnapshotCreate, 'productId'>
      >;
      courseProductSnapshotContentCreateParams?: Pick<
        IProductSnapshotContentCreate,
        'richTextContent'
      >;
      courseProductSnapshotAnnouncementCreateParams?: Pick<
        IProductSnapshotAnnouncementCreate,
        'richTextContent'
      >;
      courseProductSnapshotRefundPolicyCreateParams?: Pick<
        IProductSnapshotRefundPolicyCreate,
        'richTextContent'
      >;
      courseProductSnapshotPricingCreateParams?: Pick<
        IProductSnapshotPricingCreate,
        'amount'
      >;
      courseProductSnapshotDiscountCreateParams?: Omit<
        IProductSnapshotDiscountCreate,
        'productSnapshotId'
      > | null;
      courseProductSnapshotUiContentParams: {
        create: Omit<IProductSnapshotUiContentCreate, 'productSnapshotId'>[];
        update: IProductSnapshotUiContentUpdate[];
      };
    },
  ): Promise<NonNullableInfer<ICourseProductWithRelations>> {
    const existProduct =
      await this.findCourseProductWithRelationsOrThrow(where);

    // Create new snapshot using the given parameters.
    // If the parameter is not given, use the existing snapshot. e.g. pricing create params.
    const updatedProduct: NonNullableInfer<ICourseProductWithRelations> =
      await this.drizzle.db.transaction(async (tx) => {
        const snapshot = await this.courseProductSnapshotRepository.create(
          {
            ...existProduct.lastSnapshot,
            ...courseProductSnapshotCreateParams,
            productId: existProduct.id,
            id: createUuid(),
          },
          tx,
        );
        const content =
          await this.courseProductSnapshotContentRepository.create(
            {
              ...existProduct.lastSnapshot.content,
              ...courseProductSnapshotContentCreateParams,
              productSnapshotId: snapshot.id,
              id: createUuid(),
            },
            tx,
          );
        const announcement =
          await this.courseProductSnapshotAnnouncementRepository.create(
            {
              ...existProduct.lastSnapshot.announcement,
              ...courseProductSnapshotAnnouncementCreateParams,
              productSnapshotId: snapshot.id,
              id: createUuid(),
            },
            tx,
          );
        const refundPolicy =
          await this.courseProductSnapshotRefundPolicyRepository.create(
            {
              ...existProduct.lastSnapshot.refundPolicy,
              ...courseProductSnapshotRefundPolicyCreateParams,
              productSnapshotId: snapshot.id,
              id: createUuid(),
            },
            tx,
          );
        const pricing =
          await this.courseProductSnapshotPricingRepository.create({
            ...existProduct.lastSnapshot.pricing,
            ...courseProductSnapshotPricingCreateParams,
            productSnapshotId: snapshot.id,
            id: createUuid(),
          });
        const discount = existProduct.lastSnapshot.discounts
          ? await this.courseProductSnapshotDiscountRepository.create({
              ...existProduct.lastSnapshot.discounts,
              ...courseProductSnapshotDiscountCreateParams,
              productSnapshotId: snapshot.id,
              id: createUuid(),
            })
          : courseProductSnapshotDiscountCreateParams
            ? await this.courseProductSnapshotDiscountRepository.create({
                ...courseProductSnapshotDiscountCreateParams,
                productSnapshotId: snapshot.id,
                id: createUuid(),
              })
            : null;

        const existUi = existProduct.lastSnapshot.uiContents;
        const createUiParams: IProductSnapshotUiContentCreate[] =
          courseProductSnapshotUiContentParams?.create.map((params) => ({
            ...params,
            productSnapshotId: snapshot.id,
            id: createUuid(),
          })) ?? [];
        const updateUiParams =
          courseProductSnapshotUiContentParams?.update ?? [];
        const updateUiIds = updateUiParams.map((ui) => ui.id);
        const existSameUiParams = existUi
          .filter((ui) => !updateUiIds.includes(ui.id))
          .map((ui) => ({
            ...ui,
            productSnapshotId: snapshot.id,
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
            ? await this.courseProductSnapshotUiContentRepository.createMany(
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
        } satisfies NonNullableInfer<ICourseProductWithRelations>;
      });

    return updatedProduct;
  }
}
