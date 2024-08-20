import { IUserWithoutPassword } from '../../../v1/user/user.interface';
import { UserWithoutPasswordDto } from '../../../v1/user/user.dto';
import * as date from '../../utils/date';

export const userToDto = (
  user: IUserWithoutPassword,
): UserWithoutPasswordDto => {
  return {
    ...user,
    createdAt: date.toISOString(user.createdAt),
    updatedAt: date.toISOString(user.updatedAt),
    deletedAt: user.deletedAt ? date.toISOString(user.deletedAt) : null,
  };
};
