import { Module } from '@nestjs/common';
import { UserCouponController } from '@src/v1/user/coupon/user-coupon.controller';
import { CouponModule } from '@src/v1/coupon/coupon.module';
import { UserCouponService } from '@src/v1/user/coupon/user-coupon.service';

const modules = [CouponModule];

const providers = [UserCouponService];

@Module({
  imports: [...modules],
  controllers: [UserCouponController],
  providers: [...providers],
  exports: [...providers],
})
export class UserCouponModule {}
