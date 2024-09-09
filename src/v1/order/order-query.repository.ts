import { Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, isNotNull } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import * as typia from 'typia';
import { IOrder } from '@src/v1/order/order.interface';
import { DiscountValue, Price } from '@src/shared/types/primitive';
import {
  ICourseOrderRelations,
  ICourseOrderWithRelations,
} from '@src/v1/order/course/course-order.interface';
import { IProductSnapshotPricing } from '@src/v1/product/common/snapshot/pricing/product-snapshot-pricing.interface';
import { IProductSnapshotDiscount } from '@src/v1/product/common/snapshot/discount/product-snapshot-discount.interface';
import { IProductSnapshotContent } from '@src/v1/product/common/snapshot/content/product-snapshot-content.interface';
import { IReview } from '@src/v1/review/review.interface';
import { IProductSnapshotRefundPolicy } from '@src/v1/product/common/snapshot/refund-policy/product-snapshot-refund-policy.interface';
import { IProductSnapshotAnnouncement } from '@src/v1/product/common/snapshot/announcement/product-snapshot-announcement.interface';
import {
  IEbookOrderRelations,
  IEbookOrderWithRelations,
} from '@src/v1/order/ebook/ebook-order.interface';

@Injectable()
export class OrderQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findOrder(where: Pick<IOrder, 'id'>): Promise<IOrder | null> {
    const order = await this.drizzle.db.query.orders.findFirst({
      where: eq(dbSchema.orders.id, where.id),
    });

    return order ? typia.assert<IOrder>(order) : null;
  }

  async findOrderOrThrow(where: Pick<IOrder, 'id'>): Promise<IOrder> {
    const order = await this.findOrder(where);

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    return order;
  }

  async findCourseOrderWithRelations(
    where: Pick<IOrder, 'id'>,
  ): Promise<ICourseOrderWithRelations | null> {
    const order = await this.drizzle.db.query.orders.findFirst({
      where: eq(dbSchema.orders.id, where.id),
      with: {
        courseOrder: {
          with: {
            productSnapshot: {
              with: {
                product: {
                  with: {
                    course: {
                      with: {
                        category: true,
                        teacher: {
                          with: {
                            account: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order?.courseOrder) {
      return null;
    }

    return typia.misc.clone<ICourseOrderWithRelations>({
      ...order,
      amount: typia.assert<Price>(`${order.amount}`),
      course: {
        id: order.courseOrder.productSnapshot.product.course.id,
        teacherId: order.courseOrder.productSnapshot.product.course.teacherId,
        categoryId: order.courseOrder.productSnapshot.product.course.categoryId,
        title: order.courseOrder.productSnapshot.product.course.title,
        description:
          order.courseOrder.productSnapshot.product.course.description,
        createdAt: order.courseOrder.productSnapshot.product.course.createdAt,
        updatedAt: order.courseOrder.productSnapshot.product.course.updatedAt,
        teacher: order.courseOrder.productSnapshot.product.course.teacher,
        category: order.courseOrder.productSnapshot.product.course.category,
        chapters: [],
      },
    });
  }
  async findEbookOrdersWithRelations(
    where: Pick<IOrder, 'userId'>,
  ): Promise<IEbookOrderWithRelations[]> {
    const orders = await this.drizzle.db.query.orders.findMany({
      where: eq(dbSchema.orders.userId, where.userId),
      with: {
        ebookOrder: {
          with: {
            productSnapshot: {
              with: {
                product: {
                  with: {
                    ebook: {
                      with: {
                        category: true,
                        teacher: {
                          with: {
                            account: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return orders
      .filter((order) => order.ebookOrder)
      .map((order) =>
        typia.misc.clone<IEbookOrderWithRelations>({
          ...order,
          amount: typia.assert<Price>(`${order.amount}`),
          ebook: {
            id: order.ebookOrder!.productSnapshot.product.ebook.id,
            teacherId:
              order.ebookOrder!.productSnapshot.product.ebook.teacherId,
            categoryId:
              order.ebookOrder!.productSnapshot.product.ebook.categoryId,
            title: order.ebookOrder!.productSnapshot.product.ebook.title,
            description:
              order.ebookOrder!.productSnapshot.product.ebook.description,
            createdAt:
              order.ebookOrder!.productSnapshot.product.ebook.createdAt,
            updatedAt:
              order.ebookOrder!.productSnapshot.product.ebook.updatedAt,
            teacher: order.ebookOrder!.productSnapshot.product.ebook.teacher,
            category: order.ebookOrder!.productSnapshot.product.ebook.category,
            contents: [],
          },
        }),
      );
  }

  async findEbookOrderWithRelations(
    where: Pick<IOrder, 'id'>,
  ): Promise<IEbookOrderWithRelations | null> {
    const order = await this.drizzle.db.query.orders.findFirst({
      where: eq(dbSchema.orders.id, where.id),
      with: {
        ebookOrder: {
          with: {
            productSnapshot: {
              with: {
                product: {
                  with: {
                    ebook: {
                      with: {
                        category: true,
                        teacher: {
                          with: {
                            account: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order?.ebookOrder) {
      return null;
    }

    return typia.misc.clone<IEbookOrderWithRelations>({
      ...order,
      amount: typia.assert<Price>(`${order.amount}`),
      ebook: {
        id: order.ebookOrder.productSnapshot.product.ebook.id,
        teacherId: order.ebookOrder.productSnapshot.product.ebook.teacherId,
        categoryId: order.ebookOrder.productSnapshot.product.ebook.categoryId,
        title: order.ebookOrder.productSnapshot.product.ebook.title,
        description: order.ebookOrder.productSnapshot.product.ebook.description,
        createdAt: order.ebookOrder.productSnapshot.product.ebook.createdAt,
        updatedAt: order.ebookOrder.productSnapshot.product.ebook.updatedAt,
        teacher: order.ebookOrder.productSnapshot.product.ebook.teacher,
        category: order.ebookOrder.productSnapshot.product.ebook.category,
        contents: [],
      },
    });
  }

  async findCourseOrdersWithRelations(
    where: Pick<IOrder, 'userId'>,
  ): Promise<ICourseOrderWithRelations[]> {
    const orders = await this.drizzle.db.query.orders.findMany({
      where: and(
        eq(dbSchema.orders.userId, where.userId),
        isNotNull(dbSchema.courseOrders.id),
      ),
      with: {
        courseOrder: {
          with: {
            productSnapshot: {
              with: {
                product: {
                  with: {
                    course: {
                      with: {
                        category: true,
                        teacher: {
                          with: {
                            account: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return orders
      .filter((order) => order.courseOrder)
      .map((order) =>
        typia.misc.clone<ICourseOrderWithRelations>({
          ...order,
          amount: typia.assert<Price>(`${order.amount}`),
          course: {
            id: order.courseOrder!.productSnapshot.product.course.id,
            teacherId:
              order.courseOrder!.productSnapshot.product.course.teacherId,
            categoryId:
              order.courseOrder!.productSnapshot.product.course.categoryId,
            title: order.courseOrder!.productSnapshot.product.course.title,
            description:
              order.courseOrder!.productSnapshot.product.course.description,
            createdAt:
              order.courseOrder!.productSnapshot.product.course.createdAt,
            updatedAt:
              order.courseOrder!.productSnapshot.product.course.updatedAt,
            teacher: order.courseOrder!.productSnapshot.product.course.teacher,
            category:
              order.courseOrder!.productSnapshot.product.course.category,
            chapters: [],
          },
        }),
      );
  }

  // Todo: extract
  async findOrderWithCourseRelations(
    where: Pick<IOrder, 'id'>,
  ): Promise<ICourseOrderRelations | null> {
    const order = await this.drizzle.db.query.orders.findFirst({
      where: eq(dbSchema.orders.id, where.id),
      with: {
        courseOrder: {
          with: {
            productSnapshot: {
              with: {
                product: true,
                announcement: true,
                refundPolicy: true,
                content: true,
                pricing: true,
                discounts: true,
              },
            },
          },
        },
      },
    });

    if (!order?.courseOrder?.productSnapshot) {
      return null;
    }

    return {
      ...order,
      amount: typia.assert<Price>(`${order.amount}`),
      productOrder: {
        ...order.courseOrder,
        productSnapshot: {
          ...order.courseOrder.productSnapshot,
          courseId: order.courseOrder.productSnapshot.product.courseId,
          announcement: typia.assert<IProductSnapshotAnnouncement>(
            order.courseOrder.productSnapshot.announcement,
          ),
          refundPolicy: typia.assert<IProductSnapshotRefundPolicy>(
            order.courseOrder.productSnapshot.refundPolicy,
          ),
          content: typia.assert<IProductSnapshotContent>(
            order.courseOrder.productSnapshot.content,
          ),
          pricing: {
            ...typia.assert<Omit<IProductSnapshotPricing, 'amount'>>(
              order.courseOrder.productSnapshot.pricing,
            ),
            amount: typia.assert<Price>(
              `${order.courseOrder.productSnapshot.pricing!.amount}`,
            ),
          },
          discounts: typia.assert<IProductSnapshotDiscount | null>(
            order.courseOrder.productSnapshot.discounts
              ? ({
                  ...order.courseOrder.productSnapshot.discounts,
                  value: typia.assert<DiscountValue>(
                    `${order.courseOrder.productSnapshot.discounts.value}`,
                  ),
                } satisfies IProductSnapshotDiscount)
              : null,
          ),
        },
      },
    };
  }

  async findOrderWithCourseRelationsOrThrow(
    where: Pick<IOrder, 'id'>,
  ): Promise<ICourseOrderRelations> {
    const order = await this.findOrderWithCourseRelations(where);

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    return order;
  }

  async findOrderWithReview(
    where: Pick<IOrder, 'id' | 'productType'>,
  ): Promise<{
    order: IOrder | null;
    review: IReview | null;
  }> {
    const orderWithReview = await this.drizzle.db.query.orders.findFirst({
      where: eq(dbSchema.orders.id, where.id),
      with: {
        review: true,
        courseOrder: where.productType === 'course' ? true : undefined,
        // ebookOrder: // Todo: Impl
        //   where.productType === 'ebook' ? true : undefined,
      },
    });

    const order = orderWithReview
      ? typia.assert<IOrder>(orderWithReview)
      : null;

    return {
      order,
      review: orderWithReview?.review ?? null,
    };
  }

  // Todo: extract
  async findOrderWithEbookRelations(
    where: Pick<IOrder, 'id'>,
  ): Promise<IEbookOrderRelations | null> {
    const order = await this.drizzle.db.query.orders.findFirst({
      where: eq(dbSchema.orders.id, where.id),
      with: {
        ebookOrder: {
          with: {
            productSnapshot: {
              with: {
                product: true,
                announcement: true,
                refundPolicy: true,
                content: true,
                pricing: true,
                discounts: true,
              },
            },
          },
        },
      },
    });

    if (!order?.ebookOrder?.productSnapshot) {
      return null;
    }

    return {
      ...order,
      amount: typia.assert<Price>(`${order.amount}`),
      productOrder: {
        ...order.ebookOrder,
        productSnapshot: {
          ...order.ebookOrder.productSnapshot,
          ebookId: order.ebookOrder.productSnapshot.product.ebookId,
          announcement: typia.assert<IProductSnapshotAnnouncement>(
            order.ebookOrder.productSnapshot.announcement,
          ),
          refundPolicy: typia.assert<IProductSnapshotRefundPolicy>(
            order.ebookOrder.productSnapshot.refundPolicy,
          ),
          content: typia.assert<IProductSnapshotContent>(
            order.ebookOrder.productSnapshot.content,
          ),
          pricing: {
            ...typia.assert<Omit<IProductSnapshotPricing, 'amount'>>(
              order.ebookOrder.productSnapshot.pricing,
            ),
            amount: typia.assert<Price>(
              `${order.ebookOrder.productSnapshot.pricing!.amount}`,
            ),
          },
          discounts: typia.assert<IProductSnapshotDiscount | null>(
            order.ebookOrder.productSnapshot.discounts
              ? ({
                  ...order.ebookOrder.productSnapshot.discounts,
                  value: typia.assert<DiscountValue>(
                    `${order.ebookOrder.productSnapshot.discounts.value}`,
                  ),
                } satisfies IProductSnapshotDiscount)
              : null,
          ),
        },
      },
    };
  }

  async findOrderWithEbookRelationsOrThrow(
    where: Pick<IOrder, 'id'>,
  ): Promise<IEbookOrderRelations> {
    const order = await this.findOrderWithEbookRelations(where);

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    return order;
  }
}
