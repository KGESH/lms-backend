import {
  AuthProvider,
  BirthDate,
  EMail,
  ISO8601,
  UserRole,
  Uuid,
} from '@src/shared/types/primitive';
import { OmitPassword } from '@src/shared/types/omit-password';
import { Pagination } from '@src/shared/types/pagination';
import { OptionalPick } from '@src/shared/types/optional';

export type UserDto = {
  id: Uuid;
  displayName: string;
  email: EMail;
  emailVerified: ISO8601 | null;
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
  userId: Uuid;
  name: string;
  gender: string | null;
  phoneNumber: string | null;
  birthDate: BirthDate | null;
  connectingInformation: string | null;
  duplicationInformation: string | null;
};

export type UserAccountDto = {
  id: Uuid;
  userId: UserDto['id'];
  providerId: string | null;
  providerType: AuthProvider;
};

export type UserProfileDto = {
  user: UserWithoutPasswordDto;
  info: UserInfoDto;
  account: UserAccountDto;
};

export type UserQuery = OptionalPick<UserDto, 'role' | 'displayName'> & {
  email?: string; // Partial search
} & OptionalPick<UserInfoDto, 'name'> &
  Partial<Pagination>;
