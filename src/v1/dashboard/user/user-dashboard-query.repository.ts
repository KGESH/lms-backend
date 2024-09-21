import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { Uuid } from '@src/shared/types/primitive';
import { asc, desc, eq, sql } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import {
  IPurchasedUser,
  IUserCourseResourceHistory,
} from '@src/v1/dashboard/user/user-dashboard.interface';
import { Paginated, Pagination } from '@src/shared/types/pagination';
import { assertOrder } from '@src/shared/helpers/assert/order';

@Injectable()
export class UserDashboardQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findUserCourseResourceHistory(where: {
    userId: Uuid;
    courseId: Uuid;
  }): Promise<IUserCourseResourceHistory[]> {
    const histories =
      await this.drizzle.db.query.lessonContentAccessHistory.findMany({
        where: eq(dbSchema.lessonContentAccessHistory.userId, where.userId),
        with: {
          lessonContent: {
            with: {
              lesson: {
                with: {
                  chapter: true,
                },
              },
            },
          },
        },
      });

    return histories.map((history) => ({
      courseId: history.lessonContent.lesson.chapter.courseId,
      history: {
        id: history.id,
        lessonContentId: history.lessonContentId,
        createdAt: history.createdAt,
        lessonContent: history.lessonContent,
      },
    }));
  }

  async findPurchasedCourseUsers(
    where: { courseId: Uuid },
    pagination: Pagination,
  ): Promise<Paginated<IPurchasedUser[]>> {
    const users = await this.drizzle.db
      .select({
        user: dbSchema.users,
        order: dbSchema.orders,
        totalCount: sql<number>`count(${dbSchema.users.id}) over()`.mapWith(
          Number,
        ),
      })
      .from(dbSchema.courseProducts)
      .where(eq(dbSchema.courseProducts.courseId, where.courseId))
      .innerJoin(
        dbSchema.courseProductSnapshots,
        eq(
          dbSchema.courseProductSnapshots.productId,
          dbSchema.courseProducts.id,
        ),
      )
      .innerJoin(
        dbSchema.courseOrders,
        eq(
          dbSchema.courseOrders.productSnapshotId,
          dbSchema.courseProductSnapshots.id,
        ),
      )
      .innerJoin(
        dbSchema.orders,
        eq(dbSchema.orders.id, dbSchema.courseOrders.orderId),
      )
      .innerJoin(dbSchema.users, eq(dbSchema.users.id, dbSchema.orders.userId))
      .groupBy(dbSchema.users.id, dbSchema.orders.id)
      .orderBy(
        pagination.orderBy === 'asc'
          ? asc(dbSchema.orders.paidAt)
          : desc(dbSchema.orders.paidAt),
      )
      .offset((pagination.page - 1) * pagination.pageSize)
      .limit(pagination.pageSize);

    return {
      totalCount: users[0]?.totalCount ?? 0,
      pagination,
      data: users.map(
        ({ order, user: { password, ...userWithoutPassword } }) => ({
          user: userWithoutPassword,
          order: assertOrder(order),
        }),
      ),
    };
  }
}
