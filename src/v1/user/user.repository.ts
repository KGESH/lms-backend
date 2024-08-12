import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { asc, desc, eq, gt } from 'drizzle-orm';
import { dbSchema } from '../../infra/db/schema';
import { IUser, IUserCreate, IUserUpdate } from './user.interface';
import { IPagination } from '../../shared/types/pagination';
import {
  DEFAULT_CURSOR,
  DEFAULT_ORDER_BY,
  DEFAULT_PAGE_SIZE,
} from '../../core/pagination.constant';
import { hash } from '../../shared/helpers/hash';
import { IRepository } from '../../core/base.repository';
import { TransactionClient } from 'src/infra/db/drizzle.types';

@Injectable()
export class UserRepository implements IRepository<IUser> {
  constructor(private readonly drizzle: DrizzleService) {}

  async update(
    where: Pick<IUser, 'id'>,
    params: IUserUpdate,
    db = this.drizzle.db,
  ): Promise<IUser> {
    const [updated] = await db
      .update(dbSchema.users)
      .set(params)
      .where(eq(dbSchema.users.id, where.id))
      .returning();

    return updated;
  }

  // Todo: Impl soft delete
  delete(where: Partial<IUser>, db: TransactionClient): Promise<IUser> {
    throw new Error('Method not implemented.');
  }

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
      .orderBy(
        pagination.orderBy === 'asc'
          ? asc(dbSchema.users.id)
          : desc(dbSchema.users.id),
      );
  }

  async create(params: IUserCreate, db = this.drizzle.db): Promise<IUser> {
    const [user] = await db
      .insert(dbSchema.users)
      .values({
        ...params,
        password: params.password ? await hash(params.password) : null,
      })
      .returning();
    return user;
  }
}
