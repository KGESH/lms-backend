import { Module } from '@nestjs/common';
import { CourseProductRepository } from './course-product-repository.service';
import { CourseProductService } from './course-product.service';
import { CourseProductController } from './course-product.controller';
import { CourseProductQueryRepository } from './course-product-query.repository';
import { CourseProductSnapshotRepository } from './course-product-snapshot.repository';
import { CourseProductSnapshotPricingRepository } from './course-product-snapshot-pricing.repository';
import { CourseProductSnapshotDiscountRepository } from './course-product-snapshot-discount.repository';
import { CourseModule } from '../../course/course.module';
import { UserModule } from '../../user/user.module';
import { CourseProductSnapshotContentRepository } from './course-product-snapshot-content.repository';
import { CourseProductSnapshotQueryRepository } from './course-product-snapshot-query.repository';
import { CourseProductSnapshotAnnouncementRepository } from './course-product-snapshot-announcement.repository';
import { CourseProductSnapshotRefundPolicyRepository } from './course-product-snapshot-refund-policy.repository';

const modules = [CourseModule, UserModule];

const providers = [
  CourseProductService,
  CourseProductRepository,
  CourseProductQueryRepository,
  CourseProductSnapshotRepository,
  CourseProductSnapshotQueryRepository,
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
