import { Module } from '@nestjs/common';
import { PromotionModule } from '@src/v1/promotion/promotion.module';
import { PromotionDashboardController } from '@src/v1/dashboard/promotion/promotion-dashboard.controller';
import { PromotionDashboardService } from '@src/v1/dashboard/promotion/promotion-dashboard.service';
import { PromotionDashboardRepository } from '@src/v1/dashboard/promotion/promotion-dashboard.repository';
import { CouponModule } from '@src/v1/coupon/coupon.module';

const modules = [PromotionModule, CouponModule];

const providers = [PromotionDashboardService, PromotionDashboardRepository];

@Module({
  imports: [...modules],
  controllers: [PromotionDashboardController],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class PromotionDashboardModule {}
