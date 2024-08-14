import { UserDto, UserInfoDto } from '../user/user.dto';
import { AuthProvider, Uuid } from '../../shared/types/primitive';
import { IUser } from '../user/user.interface';

export type LoginUserDto = Pick<UserDto, 'email' | 'password'>;

export type CreateUserDto = Pick<
  UserDto,
  'email' | 'displayName' | 'password' | 'role'
>;

export type CreateUserInfoDto = Pick<
  UserInfoDto,
  | 'name'
  | 'gender'
  | 'phoneNumber'
  | 'birthDate'
  | 'connectingInformation'
  | 'duplicationInformation'
>;

export type UserAccountDto = {
  id: Uuid;
  userId: IUser['id'];
  providerId: string | null;
  providerType: AuthProvider;
};

export type CreateUserAccountDto = Pick<
  UserAccountDto,
  'providerId' | 'providerType'
>;

export type SignUpUserDto = {
  userCreateParams: CreateUserDto;
  infoCreateParams: CreateUserInfoDto;
  accountCreateParams: CreateUserAccountDto;
};

export type UpdateUserRoleDto = Pick<UserDto, 'id' | 'role'>;
