import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { asc, eq, gt } from 'drizzle-orm';
import { dbSchema } from '../../infra/db/schema';
import { IUser, IUserCreate } from './user.interface';
import { IPagination } from '../../shared/types/pagination';
import {
  DEFAULT_CURSOR,
  DEFAULT_ORDER_BY,
  DEFAULT_PAGE_SIZE,
} from './user.constant';

@Injectable()
export class UserRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findUserById(where: Pick<IUser, 'id'>): Promise<IUser | null> {
    const user = await this.drizzle.db.query.users.findFirst({
      where: eq(dbSchema.users.id, where.id),
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async findUserByIdOrThrow(where: Pick<IUser, 'id'>): Promise<IUser> {
    const user = await this.findUserById(where);

    if (!user) {
      throw new Error('User not found');
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

  async findMany(
    pagination: IPagination = {
      cursor: DEFAULT_CURSOR,
      pageSize: DEFAULT_PAGE_SIZE,
      orderBy: DEFAULT_ORDER_BY,
    },
  ): Promise<IUser[]> {
    return await this.drizzle.db
      .select()
      .from(dbSchema.users)
      .where(
        pagination.cursor
          ? gt(dbSchema.users.id, pagination.cursor)
          : undefined,
      )
      .limit(pagination.pageSize)
      .orderBy(asc(dbSchema.users.id));
  }

  async create(params: IUserCreate): Promise<IUser> {
    const [user] = await this.drizzle.db
      .insert(dbSchema.users)
      .values(params)
      .returning();
    return user;
  }
}
