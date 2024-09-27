import { Module } from '@nestjs/common';
import { PromotionController } from '@src/v1/promotion/promotion.controller';
import { PromotionService } from '@src/v1/promotion/promotion.service';
import { PromotionRepository } from '@src/v1/promotion/promotion.repository';
import { PromotionQueryRepository } from '@src/v1/promotion/promotion-query.repository';
import { PromotionContentModule } from '@src/v1/promotion/content/promotion-content.module';
import { PromotionQueryService } from '@src/v1/promotion/promotion-query.service';

const modules = [PromotionContentModule];

const providers = [
  PromotionService,
  PromotionQueryService,
  PromotionRepository,
  PromotionQueryRepository,
];

@Module({
  imports: [...modules],
  providers: [...providers],
  controllers: [PromotionController],
  exports: [...modules, ...providers],
})
export class PromotionModule {}
