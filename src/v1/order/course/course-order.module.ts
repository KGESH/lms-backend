import { Module } from '@nestjs/common';
import { CourseProductModule } from '@src/v1/product/course-product/course-product.module';
import { CourseOrderRepository } from '@src/v1/order/course/course-order.repository';
import { CourseOrderService } from '@src/v1/order/course/course-order.service';
import { CourseOrderPurchaseService } from '@src/v1/order/course/course-order-purchase.service';
import { OrderRepository } from '@src/v1/order/order.repository';
import { OrderQueryRepository } from '@src/v1/order/order-query.repository';
import { PaymentModule } from '@src/infra/payment/payment.module';
import { CouponModule } from '@src/v1/coupon/coupon.module';

const modules = [CourseProductModule, PaymentModule, CouponModule];

const providers = [
  CourseOrderService,
  OrderRepository,
  OrderQueryRepository,
  CourseOrderPurchaseService,
  CourseOrderRepository,
];

@Module({
  imports: [...modules],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class CourseOrderModule {}
