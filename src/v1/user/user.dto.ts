import { BirthDate, EMail, UserRole, Uuid } from '../../shared/types/primitive';
import { OmitPassword } from '../../shared/types/omit-password';
import { IUser } from './user.interface';

export type UserDto = {
  id: Uuid;
  displayName: string;
  email: EMail;
  emailVerified: string | null;
  password: string | null;
  role: UserRole;
  image: string | null;
};

export type UserWithoutPasswordDto = OmitPassword<UserDto>;

export type UserInfoDto = {
  id: Uuid;
  userId: IUser['id'];
  name: string;
  gender: string | null;
  phoneNumber: string | null;
  birthDate: BirthDate | null;
  connectingInformation: string | null;
  duplicationInformation: string | null;
};
