import { Module } from '@nestjs/common';
import { FileModule } from '@src/v1/file/file.module';
import { ProductThumbnailService } from '@src/v1/product/common/snapshot/thumbnail/product-thumbnail.service';

const modules = [FileModule];

const providers = [ProductThumbnailService];

@Module({
  imports: [...modules],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class ProductThumbnailModule {}
