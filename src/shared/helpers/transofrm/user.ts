import {
  IUserRelations,
  IUserWithoutPassword,
} from '@src/v1/user/user.interface';
import { UserProfileDto, UserWithoutPasswordDto } from '@src/v1/user/user.dto';
import * as date from '@src/shared/utils/date';

export const userToDto = (
  user: IUserWithoutPassword,
): UserWithoutPasswordDto => {
  return {
    id: user.id,
    displayName: user.displayName,
    email: user.email,
    image: user.image,
    role: user.role,
    emailVerified: user.emailVerified
      ? date.toISOString(user.emailVerified)
      : null,
    createdAt: date.toISOString(user.createdAt),
    updatedAt: date.toISOString(user.updatedAt),
    deletedAt: user.deletedAt ? date.toISOString(user.deletedAt) : null,
  };
};

export const userProfileToDto = (
  userRelations: IUserRelations,
): UserProfileDto => {
  return {
    user: userToDto(userRelations.user),
    info: userRelations.info,
    account: userRelations.account,
  };
};
