import { EMail, Uuid } from '../../shared/types/primitive';

export type UserDto = {
  id: Uuid;
  displayName: string;
  email: EMail;
  password: string | null;
};
