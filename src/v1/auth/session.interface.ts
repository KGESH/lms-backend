import { Uuid } from '@src/shared/types/primitive';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';

export type ISession = {
  id: string;
  userId: Uuid;
  expiresAt: Date;
};

export type ISessionWithUser = ISession & {
  user: IUserWithoutPassword;
};
