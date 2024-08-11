import { DrizzleService } from '../../../../../src/infra/db/drizzle.service';
import { dbSchema } from '../../../../../src/infra/db/schema';
import { IUser, IUserCreate } from '../../../../../src/v1/user/user.interface';
import { eq } from 'drizzle-orm';
import { hash } from '../../../../../src/shared/helpers/hash';

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
  params: IUserCreate,
  drizzle: DrizzleService,
): Promise<IUser> => {
  const [user] = await drizzle.db
    .insert(dbSchema.users)
    .values({
      ...params,
      password: params.password ? await hash(params.password) : null,
    })
    .returning();
  return user;
};
