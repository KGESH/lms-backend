import { Module } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { ReviewQueryRepository } from './review-query.repository';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewSnapshotRepository } from './review-snapshot.repository';
import { ReviewSnapshotQueryRepository } from './review-snapshot-query.repository';
import { UserModule } from '../user/user.module';
import { OrderModule } from '../order/order.module';
import { ReviewAdminService } from './review-admin.service';
import { ProductModule } from '../product/product.module';

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
