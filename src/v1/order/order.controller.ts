import { Controller } from '@nestjs/common';
import { CourseOrderPurchaseService } from './course/course-order-purchase.service';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { CourseOrderPurchaseDto } from './course/course-order-purchase.dto';
import * as date from '../../shared/utils/date';
import { OrderDto } from './order.dto';
import { toISOString } from '../../shared/utils/date';
import { Uuid } from '../../shared/types/primitive';
import { OrderService } from './order.service';
import { CreateOrderRefundDto, OrderRefundDto } from './order-refund.dto';
import { orderRefundToDto } from '../../shared/helpers/transofrm/order';

@Controller('v1/order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly courseOrderPurchaseService: CourseOrderPurchaseService,
  ) {}

  @TypedRoute.Get('/:id')
  async getOrder(@TypedParam('id') id: Uuid): Promise<OrderDto | null> {
    const order = await this.orderService.findOrderById({ id });

    if (!order) {
      return null;
    }

    if (order.productType === 'course') {
      return {
        id: order.id,
        userId: order.userId,
        productType: 'course',
        product: {
          courseId: order.productOrder.productSnapshot.courseId,
          snapshotId: order.productOrder.productSnapshot.id,
          title: order.productOrder.productSnapshot.title,
          description: order.productOrder.productSnapshot.description,
          content: {
            ...order.productOrder.productSnapshot.content,
          },
          pricing: {
            ...order.productOrder.productSnapshot.pricing,
          },
          discounts: order.productOrder.productSnapshot.discounts
            ? {
                ...order.productOrder.productSnapshot.discounts,
                validTo: order.productOrder.productSnapshot.discounts.validTo
                  ? date.toISOString(
                      order.productOrder.productSnapshot.discounts.validTo,
                    )
                  : null,
                validFrom: order.productOrder.productSnapshot.discounts
                  .validFrom
                  ? date.toISOString(
                      order.productOrder.productSnapshot.discounts.validFrom,
                    )
                  : null,
              }
            : null,
          createdAt: toISOString(order.productOrder.productSnapshot.createdAt),
          updatedAt: toISOString(order.productOrder.productSnapshot.updatedAt),
          deletedAt: order.productOrder.productSnapshot.deletedAt
            ? toISOString(order.productOrder.productSnapshot.deletedAt)
            : null,
        },
        paymentMethod: order.paymentMethod,
        amount: order.amount,
        paidAt: order.paidAt ? date.toISOString(order.paidAt) : null,
      };
    } else {
      // Todo: Impl
      return null;
    }
  }

  @TypedRoute.Post('/ebook')
  async purchaseEbookProduct() {}

  @TypedRoute.Post('/course')
  async purchaseCourseProduct(
    @TypedBody() body: CourseOrderPurchaseDto,
  ): Promise<OrderDto> {
    const { order, courseProduct } =
      await this.courseOrderPurchaseService.purchaseCourse(body);

    return {
      ...order,
      paidAt: order.paidAt ? date.toISOString(order.paidAt) : null,
      productType: 'course',
      product: {
        // id: courseProduct.id,
        courseId: courseProduct.courseId,
        snapshotId: courseProduct.lastSnapshot.id,
        title: courseProduct.lastSnapshot.title,
        description: courseProduct.lastSnapshot.description,
        content: {
          ...courseProduct.lastSnapshot.content,
        },
        pricing: {
          ...courseProduct.lastSnapshot.pricing,
        },
        discounts: courseProduct.lastSnapshot.discounts
          ? {
              ...courseProduct.lastSnapshot.discounts,
              validTo: courseProduct.lastSnapshot.discounts.validTo
                ? date.toISOString(courseProduct.lastSnapshot.discounts.validTo)
                : null,
              validFrom: courseProduct.lastSnapshot.discounts.validFrom
                ? date.toISOString(
                    courseProduct.lastSnapshot.discounts.validFrom,
                  )
                : null,
            }
          : null,
        createdAt: toISOString(courseProduct.lastSnapshot.createdAt),
        updatedAt: toISOString(courseProduct.lastSnapshot.updatedAt),
        deletedAt: courseProduct.lastSnapshot.deletedAt
          ? toISOString(courseProduct.lastSnapshot.deletedAt)
          : null,
      },
    };
  }

  @TypedRoute.Post('/:id/refund')
  async refundOrder(
    @TypedParam('id') id: Uuid,
    @TypedBody() body: CreateOrderRefundDto,
  ): Promise<OrderRefundDto> {
    const orderRefund = await this.orderService.refundOrder(
      { id },
      {
        orderId: id,
        refundedAmount: body.amount,
      },
    );

    return orderRefundToDto(orderRefund);
  }
}
