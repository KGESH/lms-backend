import { Module } from '@nestjs/common';
import { EbookProductModule } from '@src/v1/product/ebook-product/ebook-product.module';
import { EbookOrderRepository } from '@src/v1/order/ebook/ebook-order.repository';
import { EbookOrderService } from '@src/v1/order/ebook/ebook-order.service';
import { EbookOrderPurchaseService } from '@src/v1/order/ebook/ebook-order-purchase.service';
import { OrderRepository } from '@src/v1/order/order.repository';
import { OrderQueryRepository } from '@src/v1/order/order-query.repository';

const providers = [
  EbookOrderService,
  OrderRepository,
  OrderQueryRepository,
  EbookOrderPurchaseService,
  EbookOrderRepository,
];

@Module({
  imports: [EbookProductModule],
  providers: [...providers],
  exports: [...providers],
})
export class EbookOrderModule {}
