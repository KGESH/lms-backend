import { UserDto, UserInfoDto } from '@src/v1/user/user.dto';
import { AuthProvider, Uuid } from '@src/shared/types/primitive';
import { IUser } from '@src/v1/user/user.interface';
import { NonNullableInfer } from '@src/shared/types/non-nullable-infer';
import { CreateUserTermDto } from '@src/v1/term/term.dto';

export type LoginUserDto = Pick<UserDto, 'email' | 'password'>;

export type CreateUserDto = Pick<
  UserDto,
  'email' | 'displayName' | 'password' | 'role' | 'image'
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
  userTerms: CreateUserTermDto[];
};

export type UpdateUserRoleDto = Pick<UserDto, 'id' | 'role'>;

export type UpdatePasswordDto = NonNullableInfer<{
  currentPassword: UserDto['password'];
  newPassword: UserDto['password'];
}>;
