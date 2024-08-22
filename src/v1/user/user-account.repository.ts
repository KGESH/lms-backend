import { Injectable } from '@nestjs/common';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IUserAccount, IUserAccountCreate } from '@src/v1/user/user.interface';

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
