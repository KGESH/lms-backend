import {
  BirthDate,
  EMail,
  ISO8601,
  UserRole,
  Uuid,
} from '../../shared/types/primitive';
import { OmitPassword } from '../../shared/types/omit-password';
import { IUser } from './user.interface';
import { Pagination } from '../../shared/types/pagination';

export type UserDto = {
  id: Uuid;
  displayName: string;
  email: EMail;
  emailVerified: string | null;
  password: string | null;
  role: UserRole;
  image: string | null;
  createdAt: ISO8601;
  updatedAt: ISO8601;
  deletedAt: ISO8601 | null;
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

export type UserQuery = Partial<Pagination>;
