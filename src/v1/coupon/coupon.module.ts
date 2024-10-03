import { Module } from '@nestjs/common';
import { CouponRepository } from '@src/v1/coupon/coupon.repository';
import { CouponCriteriaRepository } from '@src/v1/coupon/criteria/coupon-criteria.repository';
import { CouponTicketRepository } from '@src/v1/coupon/ticket/coupon-ticket.repository';
import { CouponQueryRepository } from '@src/v1/coupon/coupon-query.repository';
import { CouponTicketPaymentRepository } from '@src/v1/coupon/ticket/payment/coupon-ticket-payment.repository';
import { CouponDisposableRepository } from '@src/v1/coupon/disposable/coupon-disposable.repository';
import { CouponController } from '@src/v1/coupon/coupon.controller';
import { CouponService } from '@src/v1/coupon/coupon.service';
import { CouponTicketController } from '@src/v1/coupon/ticket/coupon-ticket.controller';
import { CouponDisposableController } from '@src/v1/coupon/disposable/coupon-disposable.controller';
import { CouponTicketQueryRepository } from '@src/v1/coupon/ticket/coupon-ticket-query.repository';
import { CouponTicketService } from '@src/v1/coupon/ticket/coupon-ticket.service';
import { CouponTicketQueryService } from '@src/v1/coupon/ticket/coupon-ticket-query.service';
import { CouponDisposableQueryService } from '@src/v1/coupon/disposable/coupon-disposable-query.service';
import { CouponDisposableQueryRepository } from '@src/v1/coupon/disposable/coupon-disposable-query.repository';
import { UserModule } from '@src/v1/user/user.module';
import { CouponQueryService } from '@src/v1/coupon/coupon-query.service';
import { CouponDisposableService } from '@src/v1/coupon/disposable/coupon-disposable.service';
import { CouponTicketPaymentService } from '@src/v1/coupon/ticket/payment/coupon-ticket-payment.service';

const modules = [UserModule];

const providers = [
  CouponService,
  CouponRepository,
  CouponQueryService,
  CouponQueryRepository,
  CouponDisposableService,
  CouponDisposableQueryService,
  CouponDisposableRepository,
  CouponDisposableQueryRepository,
  CouponTicketService,
  CouponTicketQueryService,
  CouponTicketRepository,
  CouponTicketQueryRepository,
  CouponTicketPaymentService,
  CouponTicketPaymentRepository,
  CouponCriteriaRepository,
];

@Module({
  imports: [...modules],
  controllers: [
    CouponController,
    CouponTicketController,
    CouponDisposableController,
  ],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class CouponModule {}
