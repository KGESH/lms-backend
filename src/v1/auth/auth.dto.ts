import { UserDto } from '../user/user.dto';

export type LoginUserDto = Pick<UserDto, 'email' | 'password'>;

export type SignupUserDto = Pick<UserDto, 'email' | 'displayName' | 'password'>;

export type VerifyTokenDto = {
  accessToken: string;
};

export type RefreshTokenDto = {
  refreshToken: string;
};
