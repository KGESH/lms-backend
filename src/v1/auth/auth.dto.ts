import { UserDto, UserWithoutPasswordDto } from '../user/user.dto';

export type LoginUserDto = Pick<UserDto, 'email' | 'password'>;

export type SignupUserDto = Pick<UserDto, 'email' | 'displayName' | 'password'>;

export type AccessTokenDto = {
  accessToken: string;
};

export type RefreshTokenDto = {
  refreshToken: string;
};

export type UserWithTokensDto = UserWithoutPasswordDto &
  AccessTokenDto &
  RefreshTokenDto;
