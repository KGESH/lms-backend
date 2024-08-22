import * as typia from 'typia';
import { IUser, IUserAccount, IUserInfo } from '@src/v1/user/user.interface';

export const createMockUser = (): {
  user: IUser;
  userAccount: IUserAccount;
  userInfo: IUserInfo;
} => {
  const user = typia.random<IUser>();
  const userAccount = typia.random<IUserAccount>();
  const userInfo = typia.random<IUserInfo>();

  return {
    user,
    userAccount: {
      ...userAccount,
      userId: user.id,
    },
    userInfo: {
      ...userInfo,
      userId: user.id,
    },
  };
};
