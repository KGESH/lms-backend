import { Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, isNotNull } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import * as typia from 'typia';
import { IOrder } from '@src/v1/order/order.interface';
import { Price, Uuid } from '@src/shared/types/primitive';
import { ICourseOrderWithRelations } from '@src/v1/order/course/course-order.interface';
import { IEbookOrderWithRelations } from '@src/v1/order/ebook/ebook-order.interface';
import { IProductThumbnail } from '@src/v1/product/common/snapshot/thumbnail/product-thumbnail.interface';

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

  async findEbookOrderByEbookId(where: {
    userId: Uuid;
    ebookId: Uuid;
  }): Promise<IEbookOrderWithRelations | null> {
    const [order] = await this.drizzle.db
      .select()
      .from(dbSchema.orders)
      .where(
        and(
          eq(dbSchema.orders.userId, where.userId),
          eq(dbSchema.ebookProducts.ebookId, where.ebookId),
        ),
      )
      .innerJoin(
        dbSchema.ebookOrders,
        eq(dbSchema.orders.id, dbSchema.ebookOrders.orderId),
      )
      .innerJoin(
        dbSchema.ebookProductSnapshots,
        eq(
          dbSchema.ebookOrders.productSnapshotId,
          dbSchema.ebookProductSnapshots.id,
        ),
      )
      .innerJoin(
        dbSchema.ebookProducts,
        eq(dbSchema.ebookProductSnapshots.productId, dbSchema.ebookProducts.id),
      )
      .innerJoin(
        dbSchema.files,
        eq(dbSchema.ebookProductSnapshots.thumbnailId, dbSchema.files.id),
      );

    if (!order) {
      return null;
    }

    const ebook = await this.drizzle.db.query.ebooks.findFirst({
      where: eq(dbSchema.ebooks.id, where.ebookId),
      with: {
        category: true,
        teacher: {
          with: {
            account: true,
          },
        },
      },
    });

    if (!ebook) {
      throw new NotFoundException(`Ebook not found`);
    }

    return {
      id: order.orders.id,
      txId: order.orders.txId,
      userId: order.orders.userId,
      paymentId: order.orders.paymentId,
      amount: typia.assert<Price>(order.orders.amount),
      title: order.orders.title,
      description: order.orders.description,
      paidAt: order.orders.paidAt,
      paymentMethod: order.orders.paymentMethod,
      productType: order.orders.productType,
      ebook: {
        id: ebook.id,
        teacherId: ebook.teacherId,
        categoryId: ebook.categoryId,
        title: ebook.title,
        description: ebook.description,
        createdAt: ebook.createdAt,
        updatedAt: ebook.updatedAt,
        teacher: ebook.teacher,
        category: ebook.category,
        thumbnail: typia.assert<IProductThumbnail>(order.files),
        validUntil: order.ebook_orders.validUntil,
        contents: [],
      },
    };
  }

  async findCourseOrderByCourseId(where: {
    userId: Uuid;
    courseId: Uuid;
  }): Promise<ICourseOrderWithRelations | null> {
    const [order] = await this.drizzle.db
      .select()
      .from(dbSchema.orders)
      .where(
        and(
          eq(dbSchema.orders.userId, where.userId),
          eq(dbSchema.courseProducts.courseId, where.courseId),
        ),
      )
      .innerJoin(
        dbSchema.courseOrders,
        eq(dbSchema.orders.id, dbSchema.courseOrders.orderId),
      )
      .innerJoin(
        dbSchema.courseProductSnapshots,
        eq(
          dbSchema.courseOrders.productSnapshotId,
          dbSchema.courseProductSnapshots.id,
        ),
      )
      .innerJoin(
        dbSchema.courseProducts,
        eq(
          dbSchema.courseProductSnapshots.productId,
          dbSchema.courseProducts.id,
        ),
      )
      .innerJoin(
        dbSchema.files,
        eq(dbSchema.courseProductSnapshots.thumbnailId, dbSchema.files.id),
      );

    if (!order) {
      return null;
    }

    const course = await this.drizzle.db.query.courses.findFirst({
      where: eq(dbSchema.courses.id, where.courseId),
      with: {
        category: true,
        teacher: {
          with: {
            account: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course not found`);
    }

    return {
      id: order.orders.id,
      txId: order.orders.txId,
      userId: order.orders.userId,
      paymentId: order.orders.paymentId,
      amount: typia.assert<Price>(order.orders.amount),
      title: order.orders.title,
      description: order.orders.description,
      paidAt: order.orders.paidAt,
      paymentMethod: order.orders.paymentMethod,
      productType: order.orders.productType,
      course: {
        id: course.id,
        teacherId: course.teacherId,
        categoryId: course.categoryId,
        title: course.title,
        description: course.description,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        teacher: course.teacher,
        category: course.category,
        thumbnail: typia.assert<IProductThumbnail>(order.files),
        validUntil: order.course_orders.validUntil,
        chapters: [],
      },
    };
  }

  async findCourseOrderWithRelationsByOrderId(
    where: Pick<IOrder, 'id'>,
  ): Promise<ICourseOrderWithRelations | null> {
    const order = await this.drizzle.db.query.orders.findFirst({
      where: eq(dbSchema.orders.id, where.id),
      with: {
        courseOrder: {
          with: {
            productSnapshot: {
              with: {
                thumbnail: true,
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
        thumbnail: typia.assert<IProductThumbnail>(
          order.courseOrder!.productSnapshot.thumbnail,
        ),
        validUntil: order.courseOrder.validUntil,
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
                thumbnail: true,
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
            thumbnail: typia.assert<IProductThumbnail>(
              order.ebookOrder!.productSnapshot.thumbnail,
            ),
            validUntil: order.ebookOrder!.validUntil,
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
                thumbnail: true,
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
        thumbnail: typia.assert<IProductThumbnail>(
          order.ebookOrder!.productSnapshot.thumbnail,
        ),
        validUntil: order.ebookOrder.validUntil,
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
                thumbnail: true,
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
            thumbnail: typia.assert<IProductThumbnail>(
              order.courseOrder!.productSnapshot.thumbnail,
            ),
            validUntil: order.courseOrder!.validUntil,
            chapters: [],
          },
        }),
      );
  }
}
