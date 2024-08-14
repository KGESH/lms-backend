import {
  AuthProvider,
  BirthDate,
  EMail,
  UserRole,
  Uuid,
} from '../../shared/types/primitive';
import { OmitPassword } from '../../shared/types/omit-password';
import { Optional } from '../../shared/types/optional';

export type IUser = {
  id: Uuid;
  displayName: string;
  email: EMail;
  emailVerified: string | null;
  password: string | null;
  role: UserRole;
  image: string | null;
};

export type IUserWithoutPassword = OmitPassword<IUser>;

export type IUserCreate = Pick<
  Optional<IUser, 'id'>,
  'id' | 'email' | 'password' | 'displayName' | 'role'
>;

export type IUserUpdate = Partial<Omit<IUser, 'id'>>;

export type IUserInfo = {
  id: Uuid;
  userId: IUser['id'];
  name: string;
  gender: string | null;
  phoneNumber: string | null;
  birthDate: BirthDate | null;
  connectingInformation: string | null;
  duplicationInformation: string | null;
};

export type IUserInfoCreate = Pick<
  IUserInfo,
  | 'userId'
  | 'name'
  | 'gender'
  | 'phoneNumber'
  | 'birthDate'
  | 'connectingInformation'
  | 'duplicationInformation'
>;

export type IUserInfoUpdate = Partial<Omit<IUserInfo, 'id' | 'userId'>>;

export type IUserAccount = {
  id: Uuid;
  userId: IUser['id'];
  providerId: string | null;
  providerType: AuthProvider;
};

export type IUserAccountCreate = Optional<IUserAccount, 'id'>;
