import { Module } from '@nestjs/common';
import { CouponRepository } from '@src/v1/coupon/coupon.repository';
import { CouponCriteriaRepository } from '@src/v1/coupon/criteria/coupon-criteria.repository';
import { CouponTicketRepository } from '@src/v1/coupon/ticket/coupon-ticket.repository';
import { CouponQueryRepository } from '@src/v1/coupon/coupon-query.repository';
import { CouponTicketPaymentRepository } from '@src/v1/coupon/ticket/payment/coupon-ticket-payment.repository';
import { CouponDisposableRepository } from '@src/v1/coupon/disposable/coupon-disposable.repository';
import { CouponController } from '@src/v1/coupon/coupon.controller';

const modules = [];

const providers = [
  CouponRepository,
  CouponQueryRepository,
  CouponDisposableRepository,
  CouponTicketRepository,
  CouponTicketPaymentRepository,
  CouponCriteriaRepository,
];

@Module({
  imports: [...modules],
  controllers: [CouponController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class CouponModule {}
