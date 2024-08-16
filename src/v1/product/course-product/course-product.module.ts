import { Module } from '@nestjs/common';
import { CourseProductRepository } from './course-product-repository.service';
import { CourseProductService } from './course-product.service';
import { CourseProductController } from './course-product.controller';
import { CourseProductQueryRepository } from './course-product-query.repository';
import { CourseProductSnapshotRepository } from './snapshot/course-product-snapshot.repository';
import { CourseProductSnapshotPricingRepository } from './snapshot/pricing/course-product-snapshot-pricing.repository';
import { CourseProductSnapshotDiscountRepository } from './snapshot/discount/course-product-snapshot-discount.repository';
import { CourseModule } from '../../course/course.module';
import { UserModule } from '../../user/user.module';
import { CourseProductSnapshotContentRepository } from './snapshot/content/course-product-snapshot-content.repository';

const modules = [CourseModule, UserModule];

const providers = [
  CourseProductService,
  CourseProductRepository,
  CourseProductQueryRepository,
  CourseProductSnapshotRepository,
  CourseProductSnapshotPricingRepository,
  CourseProductSnapshotDiscountRepository,
  CourseProductSnapshotContentRepository,
];

@Module({
  imports: [...modules],
  controllers: [CourseProductController],
  providers: [...providers],
  exports: [...providers, ...modules],
})
export class CourseProductModule {}
