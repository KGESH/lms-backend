import { Uuid } from '../../shared/types/primitive';
import { Optional } from '../../shared/types/optional';
import { IUser, IUserWithoutPassword } from '../user/user.interface';
import { IUserSignUp } from '../auth/auth.interface';

export type ITeacher = {
  id: Uuid;
  userId: Uuid;
};

export type ITeacherWithAccount = ITeacher & {
  account: IUser;
};

export type ITeacherWithoutPassword = ITeacher & {
  account: IUserWithoutPassword;
};

export type ITeacherCreate = Optional<ITeacher, 'id'>;

// Role of teacher is always 'teacher'
export type ITeacherSignUp = {
  userCreateParams: Omit<IUserSignUp['userCreateParams'], 'role'>;
  infoCreateParams: IUserSignUp['infoCreateParams'];
  accountCreateParams: IUserSignUp['accountCreateParams'];
};
