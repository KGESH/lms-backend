import { IUser, IUserCreate, IUserInfoCreate } from '../user/user.interface';
import { Optional } from '../../shared/types/optional';

export type IUserLogin = Pick<IUser, 'email' | 'password'>;

export type IUserSignup = {
  userCreateParams: Optional<IUserCreate, 'id'>;
  infoCreateParams: Optional<IUserInfoCreate, 'userId'>;
};
