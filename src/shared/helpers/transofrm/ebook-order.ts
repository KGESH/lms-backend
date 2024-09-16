import { OrderEbookDto } from '@src/v1/order/order.dto';
import { IEbookOrderRelations } from '@src/v1/order/ebook/ebook-order.interface';
import * as typia from 'typia';
import * as date from '@src/shared/utils/date';
import { IEbookOrderWithRelations } from '@src/v1/order/ebook/ebook-order.interface';
import { EbookOrderDto } from '@src/v1/order/ebook/ebook-order.dto';

export const ebookOrderToDto = (ebookOrder: unknown): OrderEbookDto => {
  const order = ebookOrder as IEbookOrderRelations;
  return typia.assert<OrderEbookDto>({
    id: order.id,
    userId: order.userId,
    productType: 'ebook',
    title: order.title,
    description: order.description,
    product: {
      ebookId: order.productOrder.productSnapshot.ebookId,
      snapshotId: order.productOrder.productSnapshot.id,
      title: order.productOrder.productSnapshot.title,
      description: order.productOrder.productSnapshot.description,
      announcement: {
        ...order.productOrder.productSnapshot.announcement,
      },
      refundPolicy: {
        ...order.productOrder.productSnapshot.refundPolicy,
      },
      content: {
        ...order.productOrder.productSnapshot.content,
      },
      pricing: {
        ...order.productOrder.productSnapshot.pricing,
      },
      discount: order.productOrder.productSnapshot.discount
        ? {
            ...order.productOrder.productSnapshot.discount,
            validTo: order.productOrder.productSnapshot.discount.validTo
              ? date.toISOString(
                  order.productOrder.productSnapshot.discount.validTo,
                )
              : null,
            validFrom: order.productOrder.productSnapshot.discount.validFrom
              ? date.toISOString(
                  order.productOrder.productSnapshot.discount.validFrom,
                )
              : null,
          }
        : null,
      createdAt: date.toISOString(order.productOrder.productSnapshot.createdAt),
      updatedAt: date.toISOString(order.productOrder.productSnapshot.updatedAt),
      deletedAt: order.productOrder.productSnapshot.deletedAt
        ? date.toISOString(order.productOrder.productSnapshot.deletedAt)
        : null,
    },
    paymentMethod: order.paymentMethod,
    amount: order.amount,
    paidAt: order.paidAt ? date.toISOString(order.paidAt) : null,
  });
};

export const ebookOrderRelationsToDto = (
  ebookOrderRelations: IEbookOrderWithRelations,
): EbookOrderDto => {
  return {
    id: ebookOrderRelations.id,
    userId: ebookOrderRelations.userId,
    amount: ebookOrderRelations.amount,
    title: ebookOrderRelations.title,
    description: ebookOrderRelations.description,
    paymentMethod: ebookOrderRelations.paymentMethod,
    paidAt: ebookOrderRelations.paidAt
      ? date.toISOString(ebookOrderRelations.paidAt)
      : null,
    ebook: {
      id: ebookOrderRelations.ebook.id,
      title: ebookOrderRelations.ebook.title,
      teacherId: ebookOrderRelations.ebook.teacherId,
      categoryId: ebookOrderRelations.ebook.categoryId,
      description: ebookOrderRelations.ebook.description,
      createdAt: date.toISOString(ebookOrderRelations.ebook.createdAt),
      updatedAt: date.toISOString(ebookOrderRelations.ebook.updatedAt),
      category: ebookOrderRelations.ebook.category,
      teacher: {
        id: ebookOrderRelations.ebook.teacher.id,
        userId: ebookOrderRelations.ebook.teacher.userId,
        account: {
          ...ebookOrderRelations.ebook.teacher.account,
          emailVerified: ebookOrderRelations.ebook.teacher.account.emailVerified
            ? date.toISOString(
                ebookOrderRelations.ebook.teacher.account.emailVerified,
              )
            : null,
          createdAt: date.toISOString(
            ebookOrderRelations.ebook.teacher.account.createdAt,
          ),
          updatedAt: date.toISOString(
            ebookOrderRelations.ebook.teacher.account.updatedAt,
          ),
          deletedAt: ebookOrderRelations.ebook.teacher.account.deletedAt
            ? date.toISOString(
                ebookOrderRelations.ebook.teacher.account.deletedAt,
              )
            : null,
        },
      },
    },
  };
};
