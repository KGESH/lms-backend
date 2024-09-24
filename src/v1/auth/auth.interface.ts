import {
  IUser,
  IUserAccountCreate,
  IUserCreate,
  IUserInfoCreate,
} from '@src/v1/user/user.interface';
import { Optional } from '@src/shared/types/optional';
import { IUserTermCreate } from '@src/v1/term/term.interface';

export type IUserLogin = Pick<IUser, 'email' | 'password'>;

export type IUserSignUp = {
  userCreateParams: Optional<IUserCreate, 'id'>;
  infoCreateParams: Optional<IUserInfoCreate, 'userId'>;
  accountCreateParams: Optional<IUserAccountCreate, 'userId'>;
  userTerms: IUserTermCreate[];
};
