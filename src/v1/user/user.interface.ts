import { BirthDate, EMail, Uuid } from '../../shared/types/primitive';

export type IUser = {
  id: Uuid;
  displayName: string;
  email: EMail;
  password: string | null;
};

export type IUserWithoutPassword = Omit<IUser, 'password'>;

export type IUserCreate = Pick<IUser, 'email' | 'password' | 'displayName'>;

export type IUserAccount = {
  id: Uuid;
  userId: Uuid;
  providerId: string;
};

export type IUserInfo = {
  id: Uuid;
  userId: Uuid;
  name: string;
  birthDate: BirthDate;
  gender: string;
  phoneNumber: string;
  connectingInformation: string;
  duplicationInformation: string;
};
