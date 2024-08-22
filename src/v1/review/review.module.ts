import { Module } from '@nestjs/common';
import { UserModule } from '@src/v1/user/user.module';
import { OrderModule } from '@src/v1/order/order.module';
import { ProductModule } from '@src/v1/product/product.module';
import { ReviewRepository } from '@src/v1/review/review.repository';
import { ReviewQueryRepository } from '@src/v1/review/review-query.repository';
import { ReviewController } from '@src/v1/review/review.controller';
import { ReviewService } from '@src/v1/review/review.service';
import { ReviewSnapshotRepository } from '@src/v1/review/review-snapshot.repository';
import { ReviewSnapshotQueryRepository } from '@src/v1/review/review-snapshot-query.repository';
import { ReviewAdminService } from '@src/v1/review/review-admin.service';

const modules = [ProductModule, OrderModule, UserModule];

const providers = [
  ReviewService,
  ReviewAdminService,
  ReviewRepository,
  ReviewQueryRepository,
  ReviewSnapshotRepository,
  ReviewSnapshotQueryRepository,
];

@Module({
  imports: [...modules],
  controllers: [ReviewController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class ReviewModule {}
