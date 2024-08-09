import { EMail, Uuid } from '../../shared/types/primitive';
import { OmitPassword } from '../../shared/types/omit-password';

export type UserDto = {
  id: Uuid;
  displayName: string;
  email: EMail;
  emailVerified: string | null;
  password: string | null;
  image: string | null;
};

export type UserWithoutPasswordDto = OmitPassword<UserDto>;
