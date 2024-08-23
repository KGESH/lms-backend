import { Module } from '@nestjs/common';
import { CourseProductRepository } from '@src/v1/product/course-product/course-product.repository';
import { CourseProductService } from '@src/v1/product/course-product/course-product.service';
import { CourseProductController } from '@src/v1/product/course-product/course-product.controller';
import { CourseProductQueryRepository } from '@src/v1/product/course-product/course-product-query.repository';
import { CourseProductSnapshotRepository } from '@src/v1/product/course-product/course-product-snapshot.repository';
import { CourseProductSnapshotPricingRepository } from '@src/v1/product/course-product/course-product-snapshot-pricing.repository';
import { CourseProductSnapshotDiscountRepository } from '@src/v1/product/course-product/course-product-snapshot-discount.repository';
import { CourseModule } from '@src/v1/course/course.module';
import { UserModule } from '@src/v1/user/user.module';
import { CourseProductSnapshotContentRepository } from '@src/v1/product/course-product/course-product-snapshot-content.repository';
import { CourseProductSnapshotAnnouncementRepository } from '@src/v1/product/course-product/course-product-snapshot-announcement.repository';
import { CourseProductSnapshotRefundPolicyRepository } from '@src/v1/product/course-product/course-product-snapshot-refund-policy.repository';

const modules = [CourseModule, UserModule];

const providers = [
  CourseProductService,
  CourseProductRepository,
  CourseProductQueryRepository,
  CourseProductSnapshotRepository,
  CourseProductSnapshotPricingRepository,
  CourseProductSnapshotDiscountRepository,
  CourseProductSnapshotContentRepository,
  CourseProductSnapshotAnnouncementRepository,
  CourseProductSnapshotRefundPolicyRepository,
];

@Module({
  imports: [...modules],
  controllers: [CourseProductController],
  providers: [...providers],
  exports: [...providers, ...modules],
})
export class CourseProductModule {}
