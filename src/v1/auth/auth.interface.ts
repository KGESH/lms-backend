import {
  IUser,
  IUserAccountCreate,
  IUserCreate,
  IUserInfoCreate,
} from '@src/v1/user/user.interface';
import { Optional } from '@src/shared/types/optional';

export type IUserLogin = Pick<IUser, 'email' | 'password'>;

export type IUserSignUp = {
  userCreateParams: Optional<IUserCreate, 'id'>;
  infoCreateParams: Optional<IUserInfoCreate, 'userId'>;
  accountCreateParams: Optional<IUserAccountCreate, 'userId'>;
};
