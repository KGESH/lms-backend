import { Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, desc, eq, ilike, sql } from 'drizzle-orm';
import { IUser, IUserInfo } from '@src/v1/user/user.interface';
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

  async findUserByMatchedUsername(
    where: Pick<IUser, 'displayName'>,
  ): Promise<IUser | null> {
    const [user] = await this.drizzle.db
      .select()
      .from(dbSchema.users)
      .where(ilike(dbSchema.users.displayName, `%${where.displayName}%`));

    if (!user) {
      return null;
    }

    return user;
  }

  async findManyUsers(
    where: OptionalPick<IUser, 'role' | 'email' | 'displayName'> &
      OptionalPick<IUserInfo, 'name'>,
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
        info: dbSchema.userInfos,
        account: dbSchema.userAccounts,
        totalUserCount: sql<number>`count(*) over()`.mapWith(Number),
      })
      .from(dbSchema.users)
      .where(
        and(
          where.role ? eq(dbSchema.users.role, where.role) : undefined,
          where.displayName
            ? ilike(dbSchema.users.displayName, `%${where.displayName}%`)
            : undefined,
          where.email
            ? ilike(dbSchema.users.email, `%${where.email}%`)
            : undefined,
          where.name
            ? ilike(dbSchema.userInfos.name, `%${where.name}%`)
            : undefined,
        ),
      )
      .innerJoin(
        dbSchema.userInfos,
        eq(dbSchema.users.id, dbSchema.userInfos.userId),
      )
      .innerJoin(
        dbSchema.userAccounts,
        eq(dbSchema.users.id, dbSchema.userAccounts.userId),
      )
      .groupBy(
        dbSchema.users.id,
        dbSchema.userInfos.id,
        dbSchema.userAccounts.id,
      )
      .orderBy(
        pagination.orderBy === 'asc'
          ? asc(dbSchema.users.createdAt)
          : desc(dbSchema.users.createdAt),
      )
      .offset((pagination.page - 1) * pagination.pageSize)
      .limit(pagination.pageSize);

    return {
      pagination,
      totalCount: users[0]?.totalUserCount ?? 0,
      data: users,
    };
  }
}
