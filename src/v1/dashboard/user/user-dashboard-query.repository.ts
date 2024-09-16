import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { Uuid } from '@src/shared/types/primitive';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';
import typia from 'typia';

@Injectable()
export class UserDashboardQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findPurchasedCourseUsers(where: {
    courseId: Uuid;
  }): Promise<IUserWithoutPassword[]> {
    const courseProducts = await this.drizzle.db.query.courseProducts.findMany({
      where: eq(dbSchema.courseProducts.courseId, where.courseId),
      with: {
        snapshots: {
          with: {
            courseOrder: {
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
      .flatMap((snapshot) => snapshot.courseOrder)
      .filter((courseOrder) => !!courseOrder?.order)
      .map((courseOrder) =>
        typia.misc.clone<IUserWithoutPassword>(courseOrder!.order.user),
      );
  }
}
