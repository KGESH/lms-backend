import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { asc, desc, eq, gt } from 'drizzle-orm';
import { dbSchema } from '../../infra/db/schema';
import { IUser, IUserCreate, IUserUpdate } from './user.interface';
import { Pagination } from '../../shared/types/pagination';
import { hash } from '../../shared/helpers/hash';
import { IRepository } from '../../core/base.repository';
import { TransactionClient } from 'src/infra/db/drizzle.types';

@Injectable()
export class UserRepository {
  constructor(private readonly drizzle: DrizzleService) {}

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
}
