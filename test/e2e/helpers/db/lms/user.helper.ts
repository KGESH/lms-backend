import { DrizzleService } from '../../../../../src/infra/db/drizzle.service';
import { dbSchema } from '../../../../../src/infra/db/schema';
import { IUser } from '../../../../../src/v1/user/user.interface';
import { eq } from 'drizzle-orm';
import { hash } from '../../../../../src/shared/helpers/hash';
import { IUserSignup } from '../../../../../src/v1/auth/auth.interface';
import { IUserInfo } from '../../../../../src/v1/user/user.interface';

export const findUser = async (
  where: Pick<IUser, 'id'>,
  drizzle: DrizzleService,
): Promise<IUser | null> => {
  const user = await drizzle.db.query.users.findFirst({
    where: eq(dbSchema.users.id, where.id),
  });
  return user ?? null;
};

export const findUsers = async (drizzle: DrizzleService): Promise<IUser[]> => {
  return await drizzle.db.query.users.findMany();
};

export const createUser = async (
  { userCreateParams, infoCreateParams }: IUserSignup,
  drizzle: DrizzleService,
): Promise<{
  user: IUser;
  userInfo: IUserInfo;
}> => {
  return await drizzle.db.transaction(async (tx) => {
    const [user] = await tx
      .insert(dbSchema.users)
      .values({
        ...userCreateParams,
        password: userCreateParams.password
          ? await hash(userCreateParams.password)
          : null,
      })
      .returning();
    const [userInfo] = await tx
      .insert(dbSchema.userInfos)
      .values({
        ...infoCreateParams,
        userId: user.id,
      })
      .returning();

    return { user, userInfo };
  });
};
