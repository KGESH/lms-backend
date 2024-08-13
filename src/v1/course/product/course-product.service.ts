import { Injectable } from '@nestjs/common';
import { CourseProductRepository } from './course-product.repository';
import {
  ICourseProduct,
  ICourseProductCreate,
} from './course-product.interface';
import { CourseProductSnapshotPricingRepository } from './snapshot/pricing/course-product-snapshot-pricing.repository';
import { CourseProductSnapshotDiscountRepository } from './snapshot/discount/course-product-snapshot-discount.repository';
import { CourseProductSnapshotRepository } from './snapshot/course-product-snapshot.repository';
import { DrizzleService } from '../../../infra/db/drizzle.service';
import { CourseProductQueryRepository } from './course-product-query.repository';

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

  async createCourseProduct({
    courseProductCreateParams,
  }: {
    courseProductCreateParams: ICourseProductCreate;
  }): Promise<ICourseProduct> {
    // Check if the course product already exists
    const course = await this.courseProductQueryRepository.findOneByCourseId({
      courseId: courseProductCreateParams.courseId,
    });
    //
    // this.drizzle.db.transaction(async (tx) => {
    //   const product = await this.courseProductRepository.create(
    //     courseProductCreateParams,
    //   );
    //   // await this.courseProductSnapshotRepository
    // });

    return await this.courseProductRepository.create(courseProductCreateParams);
  }
}
