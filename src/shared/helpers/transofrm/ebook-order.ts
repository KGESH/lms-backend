import * as date from '@src/shared/utils/date';
import { IEbookOrderWithRelations } from '@src/v1/order/ebook/ebook-order.interface';
import { EbookOrderDto } from '@src/v1/order/ebook/ebook-order.dto';

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
    paidAt: date.toIsoStringOrNull(ebookOrderRelations.paidAt),
    ebook: {
      id: ebookOrderRelations.ebook.id,
      title: ebookOrderRelations.ebook.title,
      teacherId: ebookOrderRelations.ebook.teacherId,
      categoryId: ebookOrderRelations.ebook.categoryId,
      description: ebookOrderRelations.ebook.description,
      validUntil: date.toIsoStringOrNull(ebookOrderRelations.ebook.validUntil),
      createdAt: date.toISOString(ebookOrderRelations.ebook.createdAt),
      updatedAt: date.toISOString(ebookOrderRelations.ebook.updatedAt),
      category: ebookOrderRelations.ebook.category,
      thumbnail: {
        ...ebookOrderRelations.ebook.thumbnail,
        createdAt: date.toISOString(
          ebookOrderRelations.ebook.thumbnail.createdAt,
        ),
      },
      teacher: {
        id: ebookOrderRelations.ebook.teacher.id,
        userId: ebookOrderRelations.ebook.teacher.userId,
        account: {
          ...ebookOrderRelations.ebook.teacher.account,
          emailVerified: date.toIsoStringOrNull(
            ebookOrderRelations.ebook.teacher.account.emailVerified,
          ),
          createdAt: date.toISOString(
            ebookOrderRelations.ebook.teacher.account.createdAt,
          ),
          updatedAt: date.toISOString(
            ebookOrderRelations.ebook.teacher.account.updatedAt,
          ),
          deletedAt: date.toIsoStringOrNull(
            ebookOrderRelations.ebook.teacher.account.deletedAt,
          ),
        },
      },
    },
  };
};
