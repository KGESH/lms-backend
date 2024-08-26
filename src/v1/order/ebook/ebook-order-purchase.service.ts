import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { EbookOrderService } from '@src/v1/order/ebook/ebook-order.service';
import { IEbookOrderPurchase } from '@src/v1/order/ebook/ebook-order-purchase.interface';
import { EbookProductService } from '@src/v1/product/ebook-product/ebook-product.service';
import { UserService } from '@src/v1/user/user.service';
import { IEbookOrder } from '@src/v1/order/ebook/ebook-order.interface';
import { IEbookProductWithLastSnapshot } from '@src/v1/product/ebook-product/ebook-product-relations.interface';
import { NonNullableInfer } from '@src/shared/types/non-nullable-infer';
import { IOrder } from '@src/v1/order/order.interface';
import { createUuid } from '@src/shared/utils/uuid';
import * as date from '@src/shared/utils/date';
import { IEbookEnrollment } from '@src/v1/ebook/enrollment/ebook-enrollment.interface';

@Injectable()
export class EbookOrderPurchaseService {
  constructor(
    private readonly userService: UserService,
    private readonly ebookProductService: EbookProductService,
    private readonly ebookOrderService: EbookOrderService,
    private readonly drizzle: DrizzleService,
  ) {}

  async purchaseEbook(params: Omit<IEbookOrderPurchase, 'paidAt'>): Promise<{
    order: IOrder;
    ebookOrder: IEbookOrder;
    ebookProduct: NonNullableInfer<IEbookProductWithLastSnapshot>;
    enrollment: IEbookEnrollment;
  }> {
    const paidAt = date.now('date');

    const user = await this.userService.findUserByIdOrThrow({
      id: params.userId,
    });

    const ebookProduct = await this.ebookProductService.findEbookProductOrThrow(
      {
        ebookId: params.ebookId,
      },
    );

    const orderId = createUuid();
    const { order, ebookOrder, enrollment } = await this.drizzle.db.transaction(
      async (tx) => {
        return await this.ebookOrderService.createEbookOrder(
          {
            ebookId: params.ebookId,
            orderCreateParams: {
              id: orderId,
              userId: user.id,
              productType: 'ebook',
              title: ebookProduct.lastSnapshot.title,
              description: ebookProduct.lastSnapshot.description,
              paymentMethod: params.paymentMethod,
              amount: params.amount,
              paidAt,
            },
            ebookOrderCreateParams: {
              orderId,
              productSnapshotId: ebookProduct.lastSnapshot.id,
            },
          },
          tx,
        );
      },
    );

    return { order, ebookOrder, ebookProduct, enrollment };
  }
}
