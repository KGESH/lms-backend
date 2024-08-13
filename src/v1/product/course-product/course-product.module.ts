import { Module } from '@nestjs/common';
import { CourseProductRepository } from './course-product-repository.service';
import { CourseProductService } from './course-product.service';
import { CourseProductController } from './course-product.controller';
import { CourseProductQueryRepository } from './course-product-query.repository';
import { CourseProductSnapshotRepository } from './snapshot/course-product-snapshot.repository';
import { CourseProductSnapshotPricingRepository } from './snapshot/pricing/course-product-snapshot-pricing.repository';
import { CourseProductSnapshotDiscountRepository } from './snapshot/discount/course-product-snapshot-discount.repository';
import { CourseModule } from '../../course/course.module';

const providers = [
  CourseProductService,
  CourseProductRepository,
  CourseProductQueryRepository,
  CourseProductSnapshotRepository,
  CourseProductSnapshotPricingRepository,
  CourseProductSnapshotDiscountRepository,
];

@Module({
  imports: [CourseModule],
  controllers: [CourseProductController],
  providers: [...providers],
  exports: [...providers],
})
export class CourseProductModule {}
