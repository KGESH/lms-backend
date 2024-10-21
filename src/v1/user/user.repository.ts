import { Injectable } from '@nestjs/common';
import { eq, inArray } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IUser, IUserCreate, IUserUpdate } from '@src/v1/user/user.interface';
import { hash } from '@src/shared/helpers/hash';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import * as date from '@src/shared/utils/date';

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
    let updateParams = params;
    if (params.password) {
      updateParams = {
        ...params,
        password: await hash(params.password),
      };
    }

    const [updated] = await db
      .update(dbSchema.users)
      .set(updateParams)
      .where(eq(dbSchema.users.id, where.id))
      .returning();

    return updated;
  }

  async softDelete(
    where: Pick<IUser, 'id'>,
    db: TransactionClient,
  ): Promise<IUser['id']> {
    await db
      .update(dbSchema.users)
      .set({ deletedAt: date.now('date') })
      .where(eq(dbSchema.users.id, where.id));

    return where.id;
  }

  // Hard delete
  async deleteMany(ids: IUser['id'][], db = this.drizzle.db): Promise<void> {
    await db.delete(dbSchema.users).where(inArray(dbSchema.users.id, ids));
  }
}
