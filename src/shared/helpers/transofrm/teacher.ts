import { ITeacherWithoutPassword } from '@src/v1/teacher/teacher.interface';
import { TeacherDto } from '@src/v1/teacher/teacher.dto';
import * as date from '@src/shared/utils/date';
import * as typia from 'typia';

export const teacherToDto = (teacher: ITeacherWithoutPassword): TeacherDto => {
  return typia.misc.clone<TeacherDto>({
    ...teacher,
    account: {
      ...teacher.account,
      emailVerified: teacher.account.emailVerified
        ? date.toISOString(teacher.account.emailVerified)
        : null,
      createdAt: date.toISOString(teacher.account.createdAt),
      updatedAt: date.toISOString(teacher.account.updatedAt),
      deletedAt: teacher.account.deletedAt
        ? date.toISOString(teacher.account.deletedAt)
        : null,
    },
  });
};
