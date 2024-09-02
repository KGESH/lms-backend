import {
  AuthProvider,
  BirthDate,
  EMail,
  UserRole,
  Uuid,
} from '@src/shared/types/primitive';
import { OmitPassword } from '@src/shared/types/omit-password';
import { Optional } from '@src/shared/types/optional';
import { NonNullableInfer } from '@src/shared/types/non-nullable-infer';

export type IUser = {
  id: Uuid;
  displayName: string;
  email: EMail;
  emailVerified: string | null;
  password: string | null;
  role: UserRole;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type IUserWithoutPassword = OmitPassword<IUser>;

export type IUserCreate = Pick<
  Optional<IUser, 'id' | 'emailVerified'>,
  'id' | 'email' | 'password' | 'displayName' | 'role' | 'emailVerified'
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

export type IUserPasswordUpdate = NonNullableInfer<
  Pick<IUser, 'id' | 'password'>
>;
