import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { CourseOrderService } from '@src/v1/order/course/course-order.service';
import { ICourseOrderPurchase } from '@src/v1/order/course/course-order-purchase.interface';
import { CourseProductService } from '@src/v1/product/course-product/course-product.service';
import { UserService } from '@src/v1/user/user.service';
import { ICourseOrder } from '@src/v1/order/course/course-order.interface';
import {
  ICourseProductWithLastSnapshot,
  ICourseProductWithPricing,
} from '@src/v1/product/course-product/course-product-relations.interface';
import { NonNullableInfer } from '@src/shared/types/non-nullable-infer';
import { IOrder } from '@src/v1/order/order.interface';
import { createUuid } from '@src/shared/utils/uuid';
import * as date from '@src/shared/utils/date';
import { ICourseEnrollment } from '@src/v1/course/enrollment/course-enrollment.interface';
import { PaymentService } from '@src/infra/payment/payment.service';
import { CouponTicketQueryService } from '@src/v1/coupon/ticket/coupon-ticket-query.service';
import { CouponTicketPaymentService } from '@src/v1/coupon/ticket/payment/coupon-ticket-payment.service';
import { ICouponTicketRelations } from '@src/v1/coupon/ticket/coupon-ticket.interface';
import { Price } from '@src/shared/types/primitive';
import * as decimal from '@src/shared/utils/decimal';
import { ICouponCriteria } from '@src/v1/coupon/criteria/coupon-criteria.interface';
import { ICouponTicketPayment } from '@src/v1/coupon/ticket/payment/coupon-ticket-payment.interface';
import { ICoupon } from '@src/v1/coupon/coupon.interface';

@Injectable()
export class CourseOrderPurchaseService {
  private readonly logger = new Logger(CourseOrderPurchaseService.name);
  constructor(
    private readonly userService: UserService,
    private readonly courseProductService: CourseProductService,
    private readonly courseOrderService: CourseOrderService,
    private readonly paymentService: PaymentService,
    private readonly couponTicketQueryService: CouponTicketQueryService,
    private readonly couponTicketPaymentService: CouponTicketPaymentService,
    private readonly drizzle: DrizzleService,
  ) {}

  private _verifyDiscount(
    discount: ICourseProductWithPricing['lastSnapshot']['discount'],
  ): boolean {
    const { enabled, validFrom, validTo } = discount;

    if (!enabled) {
      return false;
    }

    const now = date.now('date');
    // Ex)
    // 2020-01-01 ~ 2020-02-01
    // 2020-01-01 ~ null
    // null ~ 2020-02-01
    // null ~ null
    if (validFrom && validTo) {
      return validFrom <= now && now <= validTo;
    } else if (validFrom) {
      return validFrom <= now;
    } else if (validTo) {
      return now <= validTo;
    } else {
      return true;
    }
  }

  private _verifyCourseCouponCriteriaOrThrow(
    product: ICourseProductWithPricing,
    coupon: Pick<
      ICouponTicketRelations,
      | 'couponAllCriteria'
      | 'couponCategoryCriteria'
      | 'couponTeacherCriteria'
      | 'couponCourseCriteria'
    >,
  ): void {
    const criteria: ICouponCriteria[] = [
      ...coupon.couponAllCriteria,
      ...coupon.couponCategoryCriteria,
      ...coupon.couponTeacherCriteria,
      ...coupon.couponCourseCriteria,
    ];

    criteria.forEach((criteria) => {
      switch (criteria.type) {
        case 'all':
          return;

        case 'category':
          if (
            criteria.direction === 'include' &&
            criteria.categoryId !== product.course.categoryId
          ) {
            throw new ForbiddenException(
              `Coupon category criteria direction mismatch. [include, ${product.course.categoryId}]`,
            );
          } else if (
            criteria.direction === 'exclude' &&
            criteria.categoryId === product.course.categoryId
          ) {
            throw new ForbiddenException(
              `Coupon category criteria direction mismatch. [Exclude, ${product.course.categoryId}]`,
            );
          }
          return;

        case 'teacher':
          if (
            criteria.direction === 'include' &&
            criteria.teacherId !== product.course.teacherId
          ) {
            throw new ForbiddenException(
              `Coupon teacher criteria direction mismatch. [include, ${product.course.teacherId}]`,
            );
          } else if (
            criteria.direction === 'exclude' &&
            criteria.teacherId === product.course.teacherId
          ) {
            throw new ForbiddenException(
              `Coupon teacher criteria direction mismatch. [Exclude, ${product.course.teacherId}]`,
            );
          }
          return;

        case 'course':
          if (
            criteria.direction === 'include' &&
            criteria.courseId !== product.courseId
          ) {
            throw new ForbiddenException(
              `Coupon course criteria direction mismatch. [include, ${product.courseId}]`,
            );
          } else if (
            criteria.direction === 'exclude' &&
            criteria.courseId === product.courseId
          ) {
            throw new ForbiddenException(
              `Coupon course criteria direction mismatch. [Exclude, ${product.courseId}]`,
            );
          }
          return;

        default:
          this.logger.error(
            `Invalid coupon criteria type ${JSON.stringify(criteria, null, 4)}`,
          );
          throw new Error(`Invalid coupon criteria type.`);
      }
    });
  }

  private _verifyCouponExpiryOrThrow(coupon: ICoupon): void {
    const now = date.now('date');

    const expired = coupon.expiredAt && coupon.expiredAt < now;

    if (expired) {
      throw new ForbiddenException('Expired coupon ticket');
    }
  }

  // Calculate amount with discount and coupon discount
  // Apply discount first and then apply coupon discount
  // Ex) 100,000 - 10,000(discount) - 5,000(coupon) = 85,000
  // Ex) 100,000 - 10%(discount) - 5%(coupon) = 85,500
  private _calculateAmount(
    product: Pick<
      ICourseProductWithPricing['lastSnapshot'],
      'pricing' | 'discount'
    >,
    coupon: ICoupon | null,
    rounding: 'floor' | 'ceil' = 'floor',
  ): Price {
    const { pricing, discount } = product;
    let calculatedAmount = pricing.amount;
    const needDiscount = this._verifyDiscount(discount);

    // Apply discount
    if (needDiscount) {
      if (discount.discountType === 'fixed_amount') {
        calculatedAmount = decimal.minus(calculatedAmount, discount.value);
      } else {
        calculatedAmount = decimal.multiply(
          calculatedAmount,
          decimal.divide(decimal.minus(100, discount.value), 100),
        );
      }
    }

    if (!coupon) {
      // Apply rounding if necessary
      if (rounding === 'floor') {
        calculatedAmount = decimal.floor(calculatedAmount);
      } else if (rounding === 'ceil') {
        calculatedAmount = decimal.ceil(calculatedAmount);
      }

      return calculatedAmount;
    }

    // Apply coupon discounts with threshold and limit
    const limit: Price | null = coupon.limit;
    const threshold: Price | null = coupon.threshold;

    // Check if the threshold is met
    if (threshold && decimal.lt(calculatedAmount, threshold)) {
      throw new ForbiddenException('Coupon price threshold not met');
    }

    let discountAmount: Price;

    if (coupon.discountType === 'fixed_amount') {
      discountAmount = coupon.value;
    } else {
      // Percentage discount
      discountAmount = decimal.multiply(
        calculatedAmount,
        decimal.divide(coupon.value, 100),
      );
    }

    // Apply limit to discount amount if limit is set
    if (limit && decimal.gt(discountAmount, limit)) {
      discountAmount = limit;
    }

    // Subtract discount amount from calculatedAmount
    calculatedAmount = decimal.minus(calculatedAmount, discountAmount);

    // Ensure calculatedAmount does not go below zero
    if (decimal.lt(calculatedAmount, 0)) {
      calculatedAmount = '0';
    }

    // Apply rounding if necessary
    if (rounding === 'floor') {
      calculatedAmount = decimal.floor(calculatedAmount);
    } else if (rounding === 'ceil') {
      calculatedAmount = decimal.ceil(calculatedAmount);
    }

    return calculatedAmount;
  }

  async purchaseCourse(params: Omit<ICourseOrderPurchase, 'paidAt'>): Promise<{
    order: IOrder;
    courseOrder: ICourseOrder;
    courseProduct: NonNullableInfer<ICourseProductWithLastSnapshot>;
    enrollment: ICourseEnrollment;
    usedCouponTicket: ICouponTicketPayment | null;
  }> {
    const courseProduct =
      await this.courseProductService.findCourseProductWithPricingOrThrow({
        courseId: params.courseId,
      });

    try {
      const couponRelations = params.couponTicketId
        ? await this.couponTicketQueryService.findCouponTicketRelationsOrThrow({
            id: params.couponTicketId,
          })
        : null;

      if (couponRelations) {
        // Verify coupon ticket expiry
        this._verifyCouponExpiryOrThrow(couponRelations);

        // Verify coupon tickets criteria
        this._verifyCourseCouponCriteriaOrThrow(courseProduct, couponRelations);
      }

      // Verify payment amount mismatch
      if (params.paymentId) {
        const calculatedAmount = this._calculateAmount(
          courseProduct.lastSnapshot,
          couponRelations,
        );

        const pgPaymentResult = await this.paymentService.getPgPaymentResult(
          params.paymentId,
        );

        this.paymentService.verifyPaymentOrThrow({
          pgAmount: pgPaymentResult.amount.total,
          frontendAmount: params.amount,
          calculatedBackendAmount: calculatedAmount,
        });
      }

      const paidAt = date.now('date');

      const user = await this.userService.findUserByIdOrThrow({
        id: params.userId,
      });

      const orderId = createUuid();

      const { order, courseOrder, enrollment, usedCouponTicket } =
        await this.drizzle.db.transaction(async (tx) => {
          const { order, courseOrder, enrollment } =
            await this.courseOrderService.createCourseOrder(
              {
                courseId: params.courseId,
                orderCreateParams: {
                  id: orderId,
                  userId: user.id,
                  paymentId: params.paymentId,
                  txId: params.txId,
                  productType: 'course',
                  title: courseProduct.lastSnapshot.title,
                  description: courseProduct.lastSnapshot.description,
                  paymentMethod: params.paymentMethod,
                  amount: params.amount,
                  paidAt,
                },
                courseOrderCreateParams: {
                  orderId,
                  productSnapshotId: courseProduct.lastSnapshot.id,
                },
              },
              tx,
            );

          // Use coupon tickets
          const usedCouponTicket = couponRelations
            ? await this.couponTicketPaymentService.createCouponTicketPayments(
                {
                  orderId: order.id,
                  couponTicketId: couponRelations.ticket.id,
                  createdAt: paidAt,
                },
                tx,
              )
            : null;

          return { order, courseOrder, enrollment, usedCouponTicket };
        });

      return {
        order,
        courseOrder,
        courseProduct,
        enrollment,
        usedCouponTicket,
      };
    } catch (e) {
      // If something wrong(failed), refund payment
      this.logger.error(e);
      if (params.paymentId) {
        await this.paymentService.refundPgPayment({
          paymentId: params.paymentId,
          reason: '결제 도중 오류로 인한 환불',
        });
      }
      throw e;
    }
  }
}
