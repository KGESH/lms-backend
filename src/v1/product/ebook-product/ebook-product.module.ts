import { Module } from '@nestjs/common';
import { EbookProductRepository } from '@src/v1/product/ebook-product/ebook-product.repository';
import { EbookProductService } from '@src/v1/product/ebook-product/ebook-product.service';
import { EbookProductController } from '@src/v1/product/ebook-product/ebook-product.controller';
import { EbookProductQueryRepository } from '@src/v1/product/ebook-product/ebook-product-query.repository';
import { EbookProductSnapshotRepository } from '@src/v1/product/ebook-product/ebook-product-snapshot.repository';
import { EbookProductSnapshotPricingRepository } from '@src/v1/product/ebook-product/ebook-product-snapshot-pricing.repository';
import { EbookProductSnapshotDiscountRepository } from '@src/v1/product/ebook-product/ebook-product-snapshot-discount.repository';
import { EbookModule } from '@src/v1/ebook/ebook.module';
import { UserModule } from '@src/v1/user/user.module';
import { EbookProductSnapshotContentRepository } from '@src/v1/product/ebook-product/ebook-product-snapshot-content.repository';
import { EbookProductSnapshotAnnouncementRepository } from '@src/v1/product/ebook-product/ebook-product-snapshot-announcement.repository';
import { EbookProductSnapshotRefundPolicyRepository } from '@src/v1/product/ebook-product/ebook-product-snapshot-refund-policy.repository';
import { EbookProductSnapshotUiContentRepository } from '@src/v1/product/ebook-product/ebook-product-snapshot-ui-content.repository';
import { ProductThumbnailModule } from '@src/v1/product/common/snapshot/thumbnail/product-thumbnail.module';
import { EbookProductSnapshotTableOfContentRepository } from '@src/v1/product/ebook-product/ebook-product-snapshot-table-of-content.repository';
import { EbookProductSnapshotPreviewRepository } from '@src/v1/product/ebook-product/ebook-product-snapshot-preview.repository';

const modules = [EbookModule, UserModule, ProductThumbnailModule];

const providers = [
  EbookProductService,
  EbookProductRepository,
  EbookProductQueryRepository,
  EbookProductSnapshotRepository,
  EbookProductSnapshotPricingRepository,
  EbookProductSnapshotDiscountRepository,
  EbookProductSnapshotContentRepository,
  EbookProductSnapshotAnnouncementRepository,
  EbookProductSnapshotRefundPolicyRepository,
  EbookProductSnapshotUiContentRepository,
  EbookProductSnapshotTableOfContentRepository,
  EbookProductSnapshotPreviewRepository,
];

@Module({
  imports: [...modules],
  controllers: [EbookProductController],
  providers: [...providers],
  exports: [...providers, ...modules],
})
export class EbookProductModule {}
