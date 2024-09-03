import { Controller, UseGuards } from '@nestjs/common';
import { TypedBody, TypedHeaders, TypedParam, TypedRoute } from '@nestia/core';
import { CourseOrderPurchaseService } from '@src/v1/order/course/course-order-purchase.service';
import { CourseOrderPurchaseDto } from '@src/v1/order/course/course-order-purchase.dto';
import * as date from '@src/shared/utils/date';
import {
  OrderCourseDto,
  OrderCoursePurchasedDto,
  OrderDto,
  OrderEbookDto,
  OrderEbookPurchasedDto,
} from '@src/v1/order/order.dto';
import { toISOString } from '@src/shared/utils/date';
import { Uuid } from '@src/shared/types/primitive';
import { OrderService } from '@src/v1/order/order.service';
import { CreateOrderRefundDto, OrderRefundDto } from './order-refund.dto';
import { orderRefundToDto } from '@src/shared/helpers/transofrm/order';
import { AuthHeaders } from '@src/v1/auth/auth.headers';
import { Roles } from '@src/core/decorators/roles.decorator';
import { RolesGuard } from '@src/core/guards/roles.guard';
import { EbookOrderPurchaseDto } from '@src/v1/order/ebook/ebook-order-purchase.dto';
import { EbookOrderPurchaseService } from '@src/v1/order/ebook/ebook-order-purchase.service';
import * as typia from 'typia';
import { courseRelationsToDto } from '@src/shared/helpers/transofrm/course';

@Controller('v1/order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly courseOrderPurchaseService: CourseOrderPurchaseService,
    private readonly ebookOrderPurchaseService: EbookOrderPurchaseService,
  ) {}

  /**
   * 구매한 상품 주문 내역을 조회합니다. (미완성)
   *
   * 'course' 또는 'ebook' 주문 내역을 반환합니다.
   *
   * 현재 'course'만 조회 가능합니다.
   *
   * @tag order
   * @summary 상품 주문 내역 조회
   * @param id - 조회할 주문 내역의 id
   */
  @TypedRoute.Get('/:id')
  async getOrder(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('id') id: Uuid,
  ): Promise<OrderDto | null> {
    const order = await this.orderService.findOrderWithRelations({ id });

    if (!order) {
      return null;
    }

    if (order.productType === 'course') {
      return typia.assert<OrderCourseDto>({
        id: order.id,
        userId: order.userId,
        productType: 'course',
        title: order.title,
        description: order.description,
        product: {
          ...order.productOrder.productSnapshot,
          snapshotId: order.productOrder.productSnapshot.id,
          title: order.productOrder.productSnapshot.title,
          description: order.productOrder.productSnapshot.description,
          announcement: {
            ...order.productOrder.productSnapshot.announcement,
          },
          refundPolicy: {
            ...order.productOrder.productSnapshot.refundPolicy,
          },
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
      });
    } else {
      return typia.assert<OrderEbookDto>({
        id: order.id,
        userId: order.userId,
        productType: 'ebook',
        title: order.title,
        description: order.description,
        product: {
          ...order.productOrder.productSnapshot,
          snapshotId: order.productOrder.productSnapshot.id,
          title: order.productOrder.productSnapshot.title,
          description: order.productOrder.productSnapshot.description,
          announcement: {
            ...order.productOrder.productSnapshot.announcement,
          },
          refundPolicy: {
            ...order.productOrder.productSnapshot.refundPolicy,
          },
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
      });
    }
  }

  /**
   * 전자책 상품을 구매합니다. (PG 연동 미구현)
   *
   * PG사 결제 성공시 주문 내역을 반환합니다.
   *
   * 현재 PG사 결제는 미구현 상태이며 주문 내역만 반환합니다.
   *
   * @tag order
   * @summary 전자책 상품 구매 - Role('user')
   */
  @TypedRoute.Post('/ebook')
  @Roles('user')
  @UseGuards(RolesGuard)
  async purchaseEbookProduct(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: EbookOrderPurchaseDto,
  ): Promise<OrderEbookPurchasedDto> {
    const { order, ebookProduct } =
      await this.ebookOrderPurchaseService.purchaseEbook(body);

    return {
      ...order,
      paidAt: order.paidAt ? date.toISOString(order.paidAt) : null,
      productType: 'ebook',
      product: {
        ebookId: ebookProduct.ebookId,
        snapshotId: ebookProduct.lastSnapshot.id,
        title: ebookProduct.lastSnapshot.title,
        description: ebookProduct.lastSnapshot.description,
        createdAt: toISOString(ebookProduct.lastSnapshot.createdAt),
        updatedAt: toISOString(ebookProduct.lastSnapshot.updatedAt),
        deletedAt: ebookProduct.lastSnapshot.deletedAt
          ? toISOString(ebookProduct.lastSnapshot.deletedAt)
          : null,
      },
    };
  }

  /**
   * 강의 상품을 구매합니다. (PG 연동 미구현)
   *
   * PG사 결제 성공시 주문 내역을 반환합니다.
   *
   * 현재 PG사 결제는 미구현 상태이며 주문 내역만 반환합니다.
   *
   * @tag order
   * @summary 강의 상품 구매 - Role('user')
   */
  @TypedRoute.Post('/course')
  @Roles('user')
  @UseGuards(RolesGuard)
  async purchaseCourseProduct(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CourseOrderPurchaseDto,
  ): Promise<OrderCoursePurchasedDto> {
    const { order, courseProduct } =
      await this.courseOrderPurchaseService.purchaseCourse(body);

    return {
      ...order,
      paidAt: order.paidAt ? date.toISOString(order.paidAt) : null,
      productType: 'course',
      product: {
        courseId: courseProduct.courseId,
        snapshotId: courseProduct.lastSnapshot.id,
        title: courseProduct.lastSnapshot.title,
        description: courseProduct.lastSnapshot.description,
        createdAt: toISOString(courseProduct.lastSnapshot.createdAt),
        updatedAt: toISOString(courseProduct.lastSnapshot.updatedAt),
        deletedAt: courseProduct.lastSnapshot.deletedAt
          ? toISOString(courseProduct.lastSnapshot.deletedAt)
          : null,
        course: courseRelationsToDto(courseProduct.course),
      },
    };
  }

  /**
   * 구매한 상품을 환불합니다. (미완성)
   *
   * 주문 내역 금액 전체 환불과 부분 환불을 지원합니다.
   *
   * 부분 환불의 누적 환불 금액이 주문 내역의 금액을 초과하면 환불이 불가능합니다.
   *
   * PG사 환불 성공시 환불 내역을 반환합니다.
   *
   * 현재 PG사 환불은 미구현 상태이며 환불 내역만 반환합니다.
   *
   * @tag order
   * @summary 상품 환불 - Role('user')
   * @param id - 환불할 주문 내역의 id
   */
  @TypedRoute.Post('/:id/refund')
  @Roles('admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  async refundOrder(
    @TypedHeaders() headers: AuthHeaders,
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
