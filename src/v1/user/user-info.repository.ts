import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IUserInfo,
  IUserInfoCreate,
  IUserInfoUpdate,
} from '@src/v1/user/user.interface';

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
