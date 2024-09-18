import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { Uuid } from '@src/shared/types/primitive';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';
import { IUserCourseResourceHistory } from '@src/v1/dashboard/user/user-dashboard.interface';
import * as typia from 'typia';

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

  async findPurchasedCourseUsers(where: {
    courseId: Uuid;
  }): Promise<IUserWithoutPassword[]> {
    const courseProducts = await this.drizzle.db.query.courseProducts.findMany({
      where: eq(dbSchema.courseProducts.courseId, where.courseId),
      with: {
        snapshots: {
          with: {
            courseOrders: {
              with: {
                order: {
                  with: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return courseProducts
      .flatMap((courseProduct) => courseProduct.snapshots)
      .flatMap((snapshot) => snapshot.courseOrders)
      .filter((courseOrder) => !!courseOrder?.order)
      .map((courseOrder) =>
        typia.misc.clone<IUserWithoutPassword>(courseOrder!.order.user),
      );
  }
}
