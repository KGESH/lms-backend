import { ITeacherWithoutPassword } from '../../../v1/teacher/teacher.interface';
import { TeacherDto } from '../../../v1/teacher/teacher.dto';
import * as date from '../../utils/date';

export const teacherToDto = (teacher: ITeacherWithoutPassword): TeacherDto => {
  return {
    ...teacher,
    account: {
      ...teacher.account,
      createdAt: date.toISOString(teacher.account.createdAt),
      updatedAt: date.toISOString(teacher.account.updatedAt),
      deletedAt: teacher.account.deletedAt
        ? date.toISOString(teacher.account.deletedAt)
        : null,
    },
  };
};
