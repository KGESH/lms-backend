import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IUser, IUserCreate, IUserUpdate } from '@src/v1/user/user.interface';
import { hash } from '@src/shared/helpers/hash';
import { TransactionClient } from '@src/infra/db/drizzle.types';

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
