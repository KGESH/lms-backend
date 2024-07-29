import { IUser, IUserCreate } from '../user/user.interface';

export type IUserLogin = Pick<IUser, 'email' | 'password'>;

export type IUserSignup = IUserCreate;

export type IAccessTokenPayload = {
  userId: string;
  email: string;
};

export type IRefreshTokenPayload = {
  userId: string;
};

export type IAuthTokens = {
  accessToken: string;
  refreshToken: string;
};
