import * as typia from 'typia';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';

export const assertUserWithoutPassword = (
  user: IUserWithoutPassword,
): IUserWithoutPassword =>
  typia.assert<IUserWithoutPassword>({
    id: user.id,
    displayName: user.displayName,
    email: user.email,
    emailVerified: user.emailVerified,
    role: user.role,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    deletedAt: user.deletedAt,
  });
