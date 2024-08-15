import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseProductRepository } from './course-product-repository.service';
import {
  ICourseProduct,
  ICourseProductCreate,
} from './course-product.interface';
import { CourseProductSnapshotPricingRepository } from './snapshot/pricing/course-product-snapshot-pricing.repository';
import { CourseProductSnapshotDiscountRepository } from './snapshot/discount/course-product-snapshot-discount.repository';
import { CourseProductSnapshotRepository } from './snapshot/course-product-snapshot.repository';
import { DrizzleService } from '../../../infra/db/drizzle.service';
import { CourseProductQueryRepository } from './course-product-query.repository';
import { ICourseProductSnapshotCreate } from './snapshot/conrse-product-snapshot.interface';
import { ICourseProductSnapshotPricingCreate } from './snapshot/pricing/course-product-snapshot-pricing.interface';
import { ICourseProductSnapshotDiscountCreate } from './snapshot/discount/course-product-snapshot-discount.interface';
import { ICourseProductWithRelations } from './course-product-relations.interface';
import { NonNullableInfer } from '../../../shared/types/non-nullable-infer';
import { Optional } from '../../../shared/types/optional';

@Injectable()
export class CourseProductService {
  constructor(
    private readonly courseProductRepository: CourseProductRepository,
    private readonly courseProductQueryRepository: CourseProductQueryRepository,
    private readonly courseProductSnapshotRepository: CourseProductSnapshotRepository,
    private readonly courseProductSnapshotPricingRepository: CourseProductSnapshotPricingRepository,
    private readonly courseProductSnapshotDiscountRepository: CourseProductSnapshotDiscountRepository,
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
    courseProductSnapshotPricingCreateParams,
    courseProductSnapshotDiscountCreateParams,
  }: {
    courseProductCreateParams: ICourseProductCreate;
    courseProductSnapshotCreateParams: Optional<
      ICourseProductSnapshotCreate,
      'courseProductId'
    >;
    courseProductSnapshotPricingCreateParams: Optional<
      ICourseProductSnapshotPricingCreate,
      'courseProductSnapshotId'
    >;
    courseProductSnapshotDiscountCreateParams: Optional<
      ICourseProductSnapshotDiscountCreate,
      'courseProductSnapshotId'
    > | null;
  }): Promise<NonNullableInfer<ICourseProductWithRelations>> {
    const existProduct =
      await this.courseProductQueryRepository.findOneWithLastSnapshot({
        courseId: courseProductCreateParams.courseId,
      });

    const product = await this.drizzle.db.transaction(async (tx) => {
      const courseProduct =
        existProduct ??
        (await this.courseProductRepository.create(
          courseProductCreateParams,
          tx,
        ));
      const snapshot = await this.courseProductSnapshotRepository.create(
        {
          ...courseProductSnapshotCreateParams,
          courseProductId: courseProduct.id,
        },
        tx,
      );
      const pricing = await this.courseProductSnapshotPricingRepository.create({
        ...courseProductSnapshotPricingCreateParams,
        courseProductSnapshotId: snapshot.id,
      });
      const discount = courseProductSnapshotDiscountCreateParams
        ? await this.courseProductSnapshotDiscountRepository.create({
            ...courseProductSnapshotDiscountCreateParams,
            courseProductSnapshotId: snapshot.id,
          })
        : null;

      return {
        ...courseProduct,
        lastSnapshot: {
          ...snapshot,
          pricing,
          discount,
        },
      } satisfies NonNullableInfer<ICourseProductWithRelations>;
    });

    return product;
  }
}
