import { BirthDate, EMail, Uuid } from '../../shared/types/primitive';
import { Optional } from '../../shared/types/optional';

export type ITeacher = {
  id: Uuid;
  displayName: string;
  email: EMail;
  password: string | null;
};

export type ITeacherCreate = Pick<
  Optional<ITeacher, 'id'>,
  'id' | 'email' | 'password' | 'displayName'
>;

export type ITeacherInfo = {
  id: Uuid;
  teacherId: ITeacher['id'];
  name: string;
  gender: string | null;
  birthDate: BirthDate | null;
  phoneNumber: string | null;
  connectingInformation: string | null;
  duplicationInformation: string | null;
};

export type ITeacherInfoCreate = Pick<
  ITeacherInfo,
  | 'teacherId'
  | 'name'
  | 'gender'
  | 'birthDate'
  | 'phoneNumber'
  | 'connectingInformation'
  | 'duplicationInformation'
>;

export type ITeacherSignUp = {
  teacherCreateParams: Optional<ITeacherCreate, 'id'>;
  infoCreateParams: Optional<ITeacherInfoCreate, 'teacherId'>;
};
