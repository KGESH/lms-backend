import { dbSchema } from '../../../../../src/infra/db/schema';
import { IUser } from '../../../../../src/v1/user/user.interface';
import { hash } from '../../../../../src/shared/helpers/hash';
import { IUserSignUp } from '../../../../../src/v1/auth/auth.interface';
import { IUserInfo } from '../../../../../src/v1/user/user.interface';
import * as typia from 'typia';
import { createUuid } from '../../../../../src/shared/utils/uuid';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';

export const createUser = async (
  { userCreateParams, infoCreateParams, accountCreateParams }: IUserSignUp,
  db: TransactionClient,
): Promise<{
  user: IUser;
  userInfo: IUserInfo;
}> => {
  return await db.transaction(async (tx) => {
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
    const [userAccount] = await tx
      .insert(dbSchema.userAccounts)
      .values({
        ...accountCreateParams,
        userId: user.id,
      })
      .returning();

    return { user, userInfo, userAccount };
  });
};

export const createManyUsers = async (
  createManyParams: IUserSignUp[],
  db: TransactionClient,
) => {
  return await Promise.all(
    createManyParams.map((params) => createUser(params, db)),
  );
};

export const seedUsers = async (
  { count }: { count: number },
  db: TransactionClient,
): Promise<
  {
    user: IUser;
    userInfo: IUserInfo;
  }[]
> => {
  const userCreateDtos: IUserSignUp[] = Array.from({ length: count }).map(
    () => {
      const userId = createUuid();
      return {
        userCreateParams: {
          ...typia.random<IUserSignUp['userCreateParams']>(),
          id: userId,
        },
        infoCreateParams: {
          ...typia.random<IUserSignUp['infoCreateParams']>(),
          userId,
        },
        accountCreateParams: {
          ...typia.random<IUserSignUp['accountCreateParams']>(),
          userId,
        },
      };
    },
  );

  return await createManyUsers(userCreateDtos, db);
};
