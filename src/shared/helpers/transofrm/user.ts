import { IUserWithoutPassword } from '@src/v1/user/user.interface';
import { UserWithoutPasswordDto } from '@src/v1/user/user.dto';
import * as date from '@src/shared/utils/date';

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
