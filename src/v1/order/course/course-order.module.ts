import { Module } from '@nestjs/common';
import { CourseOrderRepository } from './course-order.repository';
import { CourseOrderService } from './course-order.service';
import { CourseOrderController } from './course-order.controller';
import { CourseProductModule } from '../../product/course-product/course-product.module';
import { CourseOrderPurchaseService } from './course-order-purchase.service';

const providers = [
  CourseOrderService,
  CourseOrderPurchaseService,
  CourseOrderRepository,
];

@Module({
  imports: [CourseProductModule],
  controllers: [CourseOrderController],
  providers: [...providers],
  exports: [...providers],
})
export class CourseOrderModule {}
