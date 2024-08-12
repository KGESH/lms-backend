import { UserDto, UserInfoDto, UserWithoutPasswordDto } from '../user/user.dto';

export type LoginUserDto = Pick<UserDto, 'email' | 'password'>;

export type CreateUserDto = Pick<UserDto, 'email' | 'displayName' | 'password'>;

export type CreateUserInfoDto = Pick<
  UserInfoDto,
  | 'userId'
  | 'name'
  | 'gender'
  | 'phoneNumber'
  | 'birthDate'
  | 'connectingInformation'
  | 'duplicationInformation'
>;

export type SignupUserDto = {
  userCreateParams: CreateUserDto;
  infoCreateParams: CreateUserInfoDto;
};

export type AccessTokenDto = {
  accessToken: string;
};

export type RefreshTokenDto = {
  refreshToken: string;
};

export type UserWithTokensDto = UserWithoutPasswordDto &
  AccessTokenDto &
  RefreshTokenDto;
