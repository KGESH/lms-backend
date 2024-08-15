import { Controller } from '@nestjs/common';
import { CourseOrderPurchaseService } from './course-order-purchase.service';
import { TypedBody, TypedRoute } from '@nestia/core';
import { CourseOrderPurchaseDto } from './course-order-purchase.dto';
import { CourseOrderDto } from './course-order.dto';
import * as date from '../../../shared/utils/date';

@Controller('v1/order/course')
export class CourseOrderController {
  constructor(
    private readonly courseOrderPurchaseService: CourseOrderPurchaseService,
  ) {}

  @TypedRoute.Post('/')
  async purchaseCourseProduct(
    @TypedBody() body: CourseOrderPurchaseDto,
  ): Promise<CourseOrderDto> {
    const order = await this.courseOrderPurchaseService.purchaseCourse(body);

    return {
      ...order,
      paidAt: order.paidAt ? date.toISOString(order.paidAt) : null,
    };
  }
}
