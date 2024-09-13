import { Controller, Logger, UseGuards } from '@nestjs/common';
import { TypedBody, TypedHeaders, TypedParam, TypedRoute } from '@nestia/core';
import { CourseOrderPurchaseService } from '@src/v1/order/course/course-order-purchase.service';
import { CourseOrderPurchaseDto } from '@src/v1/order/course/course-order-purchase.dto';
import * as date from '@src/shared/utils/date';
import {
  OrderCoursePurchasedDto,
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
import { courseRelationsToDto } from '@src/shared/helpers/transofrm/course';
import { SessionUser } from '@src/core/decorators/session-user.decorator';
import { ISessionWithUser } from '@src/v1/auth/session.interface';
import { ebookRelationsToDto } from '@src/shared/helpers/transofrm/ebook';
import { courseOrderRelationsToDto } from '@src/shared/helpers/transofrm/course-order';
import { ebookOrderRelationsToDto } from '@src/shared/helpers/transofrm/ebook-order';
import { CourseOrderDto } from '@src/v1/order/course/course-order.dto';
import { EbookOrderDto } from '@src/v1/order/ebook/ebook-order.dto';
import { OrdersDto } from '@src/v1/order/order-relations.dto';

@Controller('v1/order')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);
  constructor(
    private readonly orderService: OrderService,
    private readonly courseOrderPurchaseService: CourseOrderPurchaseService,
    private readonly ebookOrderPurchaseService: EbookOrderPurchaseService,
  ) {}

  /**
   * 구매한 강의와 전자책 상품 주문 내역 목록을 조회합니다.
   *
   * @tag order
   * @summary 모든 상품 주문 내역 목록 조회
   */
  @TypedRoute.Get('/')
  async getOrders(
    @TypedHeaders() headers: AuthHeaders,
    @SessionUser() session: ISessionWithUser,
  ): Promise<OrdersDto> {
    const courseOrders = await this.orderService.findCourseOrdersWithRelations({
      userId: session.userId,
    });

    const ebookOrders = await this.orderService.findEbookOrdersWithRelations({
      userId: session.userId,
    });

    return {
      courses: courseOrders.map(courseOrderRelationsToDto),
      ebooks: ebookOrders.map(ebookOrderRelationsToDto),
    };
  }

  /**
   * 구매한 강의 상품 주문 내역 목록을 조회합니다.
   *
   * @tag order
   * @summary 강의 상품 주문 내역 목록 조회
   */
  @TypedRoute.Get('/course')
  async getCourseOrders(
    @TypedHeaders() headers: AuthHeaders,
    @SessionUser() session: ISessionWithUser,
  ): Promise<CourseOrderDto[]> {
    const courseOrders = await this.orderService.findCourseOrdersWithRelations({
      userId: session.userId,
    });

    return courseOrders.map(courseOrderRelationsToDto);
  }

  /**
   * 구매한 전자책 상품 주문 내역 목록을 조회합니다.
   *
   * @tag order
   * @summary 전자책 상품 주문 내역 목록 조회
   */
  @TypedRoute.Get('/ebook')
  async getEbookOrders(
    @TypedHeaders() headers: AuthHeaders,
    @SessionUser() session: ISessionWithUser,
  ): Promise<EbookOrderDto[]> {
    const ebookOrders = await this.orderService.findEbookOrdersWithRelations({
      userId: session.userId,
    });

    return ebookOrders.map(ebookOrderRelationsToDto);
  }

  /**
   * 구매한 강의 상품 주문 내역을 조회합니다. (미완성)
   *
   * @tag order
   * @summary 강의 상품 주문 내역 조회
   * @param orderId - 조회할 강의 상품 주문 내역의 id
   */
  @TypedRoute.Get('/course/:orderId')
  async getCourseOrder(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('orderId') orderId: Uuid,
  ): Promise<CourseOrderDto | null> {
    const courseOrder = await this.orderService.findCourseOrderWithRelations({
      id: orderId,
    });

    if (!courseOrder) {
      return null;
    }

    return courseOrderRelationsToDto(courseOrder);
  }

  /**
   * 구매한 전자책 상품 주문 내역을 조회합니다. (미완성)
   *
   * @tag order
   * @summary 전자책 상품 주문 내역 조회
   * @param orderId - 조회할 전자책 상품 주문 내역의 id
   */
  @TypedRoute.Get('/ebook/:orderId')
  async getEbookOrder(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('orderId') orderId: Uuid,
  ): Promise<EbookOrderDto | null> {
    const ebookOrder = await this.orderService.findEbookOrderWithRelations({
      id: orderId,
    });

    if (!ebookOrder) {
      return null;
    }

    return ebookOrderRelationsToDto(ebookOrder);
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
  @Roles('user', 'teacher', 'manager', 'admin')
  @UseGuards(RolesGuard)
  async purchaseEbookProduct(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: EbookOrderPurchaseDto,
    @SessionUser() session: ISessionWithUser,
  ): Promise<OrderEbookPurchasedDto> {
    const { order, ebookProduct } =
      await this.ebookOrderPurchaseService.purchaseEbook({
        ...body,
        userId: session.userId,
      });

    return {
      ...order,
      paidAt: order.paidAt ? date.toISOString(order.paidAt) : null,
      productType: 'ebook',
      product: {
        ebook: ebookRelationsToDto(ebookProduct.ebook),
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
   * 강의 상품을 구매합니다.
   *
   * PG사 결제 성공시 주문 내역을 반환합니다.
   *
   * 현재 PG사 결제는 미구현 상태이며 주문 내역만 반환합니다.
   *
   * @tag order
   * @summary 강의 상품 구매 - Role('user')
   */
  @TypedRoute.Post('/course')
  @Roles('user', 'teacher', 'manager', 'admin')
  @UseGuards(RolesGuard)
  async purchaseCourseProduct(
    @TypedHeaders() headers: AuthHeaders,
    @TypedBody() body: CourseOrderPurchaseDto,
    @SessionUser() session: ISessionWithUser,
  ): Promise<OrderCoursePurchasedDto> {
    const { order, courseProduct } =
      await this.courseOrderPurchaseService.purchaseCourse({
        ...body,
        userId: session.userId,
      });

    return {
      ...order,
      paidAt: order.paidAt ? date.toISOString(order.paidAt) : null,
      productType: 'course',
      product: {
        course: courseRelationsToDto(courseProduct.course),
        courseId: courseProduct.courseId,
        snapshotId: courseProduct.lastSnapshot.id,
        title: courseProduct.lastSnapshot.title,
        description: courseProduct.lastSnapshot.description,
        createdAt: toISOString(courseProduct.lastSnapshot.createdAt),
        updatedAt: toISOString(courseProduct.lastSnapshot.updatedAt),
        deletedAt: courseProduct.lastSnapshot.deletedAt
          ? toISOString(courseProduct.lastSnapshot.deletedAt)
          : null,
      },
    };
  }

  /**
   * 구매한 상품을 환불합니다.
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
   * @param orderId - 환불할 상품의 주문 id
   */
  @TypedRoute.Post('/:orderId/refund')
  @Roles('admin', 'manager', 'teacher')
  @UseGuards(RolesGuard)
  async refundOrder(
    @TypedHeaders() headers: AuthHeaders,
    @TypedParam('orderId') orderId: Uuid,
    @TypedBody() body: CreateOrderRefundDto,
  ): Promise<OrderRefundDto> {
    const orderRefund = await this.orderService.refundOrder(
      { id: orderId },
      {
        refundedAmount: body.amount,
        reason: body.reason,
      },
    );

    return orderRefundToDto(orderRefund);
  }
}
