import { Injectable, NotFoundException } from '@nestjs/common';
import { asc, desc, eq, sql } from 'drizzle-orm';
import { IUser } from '@src/v1/user/user.interface';
import { dbSchema } from '@src/infra/db/schema';
import { Paginated, Pagination } from '@src/shared/types/pagination';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { OptionalPick } from '@src/shared/types/optional';

@Injectable()
export class UserQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findOne(where: Pick<IUser, 'id'>): Promise<IUser | null> {
    const user = await this.drizzle.db.query.users.findFirst({
      where: eq(dbSchema.users.id, where.id),
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async findOneOrThrow(where: Pick<IUser, 'id'>): Promise<IUser> {
    const user = await this.findOne(where);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findUserByEmail(where: Pick<IUser, 'email'>): Promise<IUser | null> {
    const user = await this.drizzle.db.query.users.findFirst({
      where: eq(dbSchema.users.email, where.email),
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async findManyUsers(
    where: OptionalPick<IUser, 'role'>,
    pagination: Pagination,
  ): Promise<Paginated<IUser[]>> {
    const users = await this.drizzle.db
      .select({
        id: dbSchema.users.id,
        displayName: dbSchema.users.displayName,
        email: dbSchema.users.email,
        password: dbSchema.users.password,
        emailVerified: dbSchema.users.emailVerified,
        role: dbSchema.users.role,
        image: dbSchema.users.image,
        createdAt: dbSchema.users.createdAt,
        updatedAt: dbSchema.users.updatedAt,
        deletedAt: dbSchema.users.deletedAt,
        totalUserCount: sql<number>`count(*) over()`.mapWith(Number),
      })
      .from(dbSchema.users)
      .where(where.role ? eq(dbSchema.users.role, where.role) : undefined)
      .orderBy(
        pagination.orderBy === 'asc'
          ? asc(dbSchema.users.createdAt)
          : desc(dbSchema.users.createdAt),
      )
      .offset((pagination.page - 1) * pagination.pageSize)
      .limit(pagination.pageSize);

    return {
      data: users,
      pagination,
      totalCount: users[0].totalUserCount,
    };
  }
}
