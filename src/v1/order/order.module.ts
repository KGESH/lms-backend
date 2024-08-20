import { Module } from '@nestjs/common';
import { CourseOrderModule } from './course/course-order.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderQueryRepository } from './order-query.repository';
import { OrderRefundRepository } from './order-refund.repository';

const modules = [CourseOrderModule];

const providers = [OrderService, OrderQueryRepository, OrderRefundRepository];

@Module({
  imports: [...modules],
  controllers: [OrderController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class OrderModule {}
