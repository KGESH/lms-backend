import { Module } from '@nestjs/common';
import { CourseOrderModule } from './course/course-order.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderQueryRepository } from './order-query.repository';

const modules = [CourseOrderModule];

const providers = [OrderService, OrderQueryRepository];

@Module({
  imports: [...modules],
  controllers: [OrderController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class OrderModule {}
