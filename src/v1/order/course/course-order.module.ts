import { Module } from '@nestjs/common';
import { CourseOrderRepository } from './course-order.repository';
import { CourseOrderService } from './course-order.service';
import { CourseProductModule } from '../../product/course-product/course-product.module';
import { CourseOrderPurchaseService } from './course-order-purchase.service';
import { OrderRepository } from '../order.repository';
import { OrderQueryRepository } from '../order-query.repository';

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
