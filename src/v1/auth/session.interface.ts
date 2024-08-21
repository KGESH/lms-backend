import { Uuid } from '../../shared/types/primitive';
import { IUserWithoutPassword } from '../user/user.interface';

export type ISession = {
  id: string;
  userId: Uuid;
  expiresAt: Date;
};

export type ISessionWithUser = ISession & {
  user: IUserWithoutPassword;
};
