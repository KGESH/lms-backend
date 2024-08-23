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
import { ICourseProductWithRelations } from '@src/v1/product/course-product/course-product-relations.interface';
import { NonNullableInfer } from '@src/shared/types/non-nullable-infer';
import { Optional } from '@src/shared/types/optional';
import { CourseProductSnapshotContentRepository } from '@src/v1/product/course-product/course-product-snapshot-content.repository';
import { IProductSnapshotContentCreate } from '@src/v1/product/common/snapshot/content/product-snapshot-content.interface';
import { CourseProductSnapshotAnnouncementRepository } from '@src/v1/product/course-product/course-product-snapshot-announcement.repository';
import { CourseProductSnapshotRefundPolicyRepository } from '@src/v1/product/course-product/course-product-snapshot-refund-policy.repository';
import { IProductSnapshotAnnouncementCreate } from '@src/v1/product/common/snapshot/announcement/product-snapshot-announcement.interface';
import { IProductSnapshotRefundPolicyCreate } from '@src/v1/product/common/snapshot/refund-policy/product-snapshot-refund-policy.interface';

@Injectable()
export class CourseProductService {
  constructor(
    private readonly courseProductRepository: CourseProductRepository,
    private readonly courseProductQueryRepository: CourseProductQueryRepository,
    private readonly courseProductSnapshotRepository: CourseProductSnapshotRepository,
    private readonly courseProductSnapshotPricingRepository: CourseProductSnapshotPricingRepository,
    private readonly courseProductSnapshotDiscountRepository: CourseProductSnapshotDiscountRepository,
    private readonly courseProductSnapshotContentRepository: CourseProductSnapshotContentRepository,
    private readonly courseProductSnapshotAnnouncementRepository: CourseProductSnapshotAnnouncementRepository,
    private readonly courseProductSnapshotRefundPolicyRepository: CourseProductSnapshotRefundPolicyRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async findCourseProduct(
    where: Pick<ICourseProduct, 'courseId'>,
  ): Promise<ICourseProductWithRelations | null> {
    return await this.courseProductQueryRepository.findOneWithRelations(where);
  }

  async findCourseProductOrThrow(
    where: Pick<ICourseProduct, 'courseId'>,
  ): Promise<NonNullableInfer<ICourseProductWithRelations>> {
    const courseProduct = await this.findCourseProduct(where);

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
    courseProductSnapshotContentCreateParams,
    courseProductSnapshotAnnouncementCreateParams,
    courseProductSnapshotRefundPolicyCreateParams,
    courseProductSnapshotPricingCreateParams,
    courseProductSnapshotDiscountCreateParams,
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
  }): Promise<NonNullableInfer<ICourseProductWithRelations>> {
    const existProduct =
      await this.courseProductQueryRepository.findOneWithLastSnapshot({
        courseId: courseProductCreateParams.courseId,
      });

    const product: NonNullableInfer<ICourseProductWithRelations> =
      await this.drizzle.db.transaction(async (tx) => {
        const courseProduct =
          existProduct ??
          (await this.courseProductRepository.create(
            courseProductCreateParams,
            tx,
          ));
        const snapshot = await this.courseProductSnapshotRepository.create(
          {
            ...courseProductSnapshotCreateParams,
            productId: courseProduct.id,
          },
          tx,
        );
        const content =
          await this.courseProductSnapshotContentRepository.create({
            ...courseProductSnapshotContentCreateParams,
            productSnapshotId: snapshot.id,
          });
        const announcement =
          await this.courseProductSnapshotAnnouncementRepository.create({
            ...courseProductSnapshotAnnouncementCreateParams,
            productSnapshotId: snapshot.id,
          });
        const refundPolicy =
          await this.courseProductSnapshotRefundPolicyRepository.create({
            ...courseProductSnapshotRefundPolicyCreateParams,
            productSnapshotId: snapshot.id,
          });
        const pricing =
          await this.courseProductSnapshotPricingRepository.create({
            ...courseProductSnapshotPricingCreateParams,
            productSnapshotId: snapshot.id,
          });
        const discount = courseProductSnapshotDiscountCreateParams
          ? await this.courseProductSnapshotDiscountRepository.create({
              ...courseProductSnapshotDiscountCreateParams,
              productSnapshotId: snapshot.id,
            })
          : null;

        return {
          ...courseProduct,
          lastSnapshot: {
            ...snapshot,
            announcement,
            refundPolicy,
            pricing,
            discounts: discount,
            content,
          },
        } satisfies NonNullableInfer<ICourseProductWithRelations>;
      });

    return product;
  }
}
