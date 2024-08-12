import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { IUserInfo, IUserInfoCreate, IUserInfoUpdate } from './user.interface';
import { dbSchema } from '../../infra/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserInfoRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: IUserInfoCreate,
    db = this.drizzle.db,
  ): Promise<IUserInfo> {
    const [userInfo] = await db
      .insert(dbSchema.userInfos)
      .values({
        ...params,
      })
      .returning();
    return userInfo;
  }

  async update(
    where: Pick<IUserInfo, 'userId'>,
    params: IUserInfoUpdate,
    db = this.drizzle.db,
  ) {
    const [updated] = await db
      .update(dbSchema.userInfos)
      .set(params)
      .where(eq(dbSchema.userInfos.userId, where.userId))
      .returning();
    return updated;
  }
}
