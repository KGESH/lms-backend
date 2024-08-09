import { BirthDate, EMail, Uuid } from '../../shared/types/primitive';
import { OmitPassword } from '../../shared/types/omit-password';

export type IUser = {
  id: Uuid;
  displayName: string;
  email: EMail;
  emailVerified: string | null;
  password: string | null;
  image: string | null;
};

export type IUserWithoutPassword = OmitPassword<IUser>;

export type IUserCreate = Pick<IUser, 'email' | 'password' | 'displayName'>;

export type IUserAccount = {
  id: Uuid;
  userId: IUser['id'];
  providerId: string;
};

export type IUserInfo = {
  id: Uuid;
  userId: IUser['id'];
  name: string;
  gender: string;
  phoneNumber: string;
  birthDate: BirthDate;
  connectingInformation: string;
  duplicationInformation: string;
};
