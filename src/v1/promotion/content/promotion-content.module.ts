import { Module } from '@nestjs/common';
import { PromotionContentService } from '@src/v1/promotion/content/promotion-content.service';
import { PromotionContentRepository } from '@src/v1/promotion/content/promotion-content.repository';
import { FileModule } from '@src/v1/file/file.module';

const modules = [FileModule];

const providers = [PromotionContentService, PromotionContentRepository];

@Module({
  imports: [...modules],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class PromotionContentModule {}
