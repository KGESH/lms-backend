import { Module } from '@nestjs/common';
import { UserModule } from '@src/v1/user/user.module';
import { OrderModule } from '@src/v1/order/order.module';
import { ProductModule } from '@src/v1/product/product.module';
import { ReviewRepository } from '@src/v1/review/review.repository';
import { ReviewQueryRepository } from '@src/v1/review/review-query.repository';
import { ReviewService } from '@src/v1/review/review.service';
import { ReviewSnapshotRepository } from '@src/v1/review/review-snapshot.repository';
import { ReviewSnapshotQueryRepository } from '@src/v1/review/review-snapshot-query.repository';
import { ReviewReplyService } from '@src/v1/review/review-reply.service';
import { ReviewReplyRepository } from '@src/v1/review/review-reply.repository';
import { ReviewReplySnapshotRepository } from '@src/v1/review/review-reply-snapshot.repository';
import { ReviewController } from '@src/v1/review/review.controller';

const modules = [ProductModule, OrderModule, UserModule];

const providers = [
  ReviewService,
  ReviewReplyService,
  ReviewRepository,
  ReviewQueryRepository,
  ReviewSnapshotRepository,
  ReviewSnapshotQueryRepository,
  ReviewReplyRepository,
  ReviewReplySnapshotRepository,
];

@Module({
  imports: [...modules],
  controllers: [ReviewController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class ReviewModule {}
