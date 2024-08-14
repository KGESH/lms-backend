import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { IUserAccount, IUserAccountCreate } from './user.interface';
import { dbSchema } from '../../infra/db/schema';

@Injectable()
export class UserAccountRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: IUserAccountCreate,
    db = this.drizzle.db,
  ): Promise<IUserAccount> {
    const [userAccount] = await db
      .insert(dbSchema.userAccounts)
      .values(params)
      .returning();
    return userAccount;
  }
}
