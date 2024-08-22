import { Module } from '@nestjs/common';
import { CourseProductModule } from '@src/v1/product/course-product/course-product.module';
import { CourseOrderRepository } from '@src/v1/order/course/course-order.repository';
import { CourseOrderService } from '@src/v1/order/course/course-order.service';
import { CourseOrderPurchaseService } from '@src/v1/order/course/course-order-purchase.service';
import { OrderRepository } from '@src/v1/order/order.repository';
import { OrderQueryRepository } from '@src/v1/order/order-query.repository';

const providers = [
  CourseOrderService,
  OrderRepository,
  OrderQueryRepository,
  CourseOrderPurchaseService,
  CourseOrderRepository,
];

@Module({
  imports: [CourseProductModule],
  providers: [...providers],
  exports: [...providers],
})
export class CourseOrderModule {}
