import { Module } from '@nestjs/common';
import { CourseOrderModule } from '@src/v1/order/course/course-order.module';
import { OrderController } from '@src/v1/order/order.controller';
import { OrderService } from '@src/v1/order/order.service';
import { OrderQueryRepository } from '@src/v1/order/order-query.repository';
import { OrderRefundRepository } from '@src/v1/order/order-refund.repository';

const modules = [CourseOrderModule];

const providers = [OrderService, OrderQueryRepository, OrderRefundRepository];

@Module({
  imports: [...modules],
  controllers: [OrderController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class OrderModule {}
