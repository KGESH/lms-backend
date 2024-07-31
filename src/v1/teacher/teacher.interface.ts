import { BirthDate, EMail, Uuid } from '../../shared/types/primitive';

export type ITeacher = {
  id: Uuid;
  displayName: string;
  email: EMail;
  password: string | null;
};

export type ITeacherCreate = Pick<
  ITeacher,
  'email' | 'password' | 'displayName'
>;

export type ITeacherInfo = {
  id: Uuid;
  teacherId: ITeacher['id'];
  name: string;
  gender: string;
  birthDate: BirthDate;
  phoneNumber: string;
  connectingInformation: string;
  duplicationInformation: string;
};
