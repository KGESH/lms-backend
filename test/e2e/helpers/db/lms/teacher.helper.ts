import { dbSchema } from '../../../../../src/infra/db/schema';
import { eq } from 'drizzle-orm';
import {
  ITeacher,
  ITeacherInfo,
  ITeacherSignUp,
} from '../../../../../src/v1/teacher/teacher.interface';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import { createUuid } from '../../../../../src/shared/utils/uuid';
import * as typia from 'typia';

export const findTeacher = async (
  where: Pick<ITeacher, 'id'>,
  db: TransactionClient,
): Promise<ITeacher | null> => {
  const course = await db.query.teachers.findFirst({
    where: eq(dbSchema.teachers.id, where.id),
  });
  return course ?? null;
};

export const createTeacher = async (
  { teacherCreateParams, infoCreateParams }: ITeacherSignUp,
  db: TransactionClient,
): Promise<{
  teacher: ITeacher;
  teacherInfo: ITeacherInfo;
}> => {
  return await db.transaction(async (tx) => {
    const [teacher] = await tx
      .insert(dbSchema.teachers)
      .values(teacherCreateParams)
      .returning();

    const [teacherInfo] = await tx
      .insert(dbSchema.teacherInfos)
      .values({
        ...infoCreateParams,
        teacherId: teacher.id,
      })
      .returning();

    return { teacher, teacherInfo };
  });
};

export const createManyTeachers = async (
  createManyParams: ITeacherSignUp[],
  db: TransactionClient,
) => {
  return await Promise.all(
    createManyParams.map((params) => createTeacher(params, db)),
  );
};

export const seedTeachers = async (
  { count }: { count: number },
  db: TransactionClient,
): Promise<
  {
    teacher: ITeacher;
    teacherInfo: ITeacherInfo;
  }[]
> => {
  const teacherCreateDtos: ITeacherSignUp[] = Array.from({ length: count }).map(
    () => {
      const teacherId = createUuid();
      return {
        teacherCreateParams: {
          ...typia.random<ITeacherSignUp['teacherCreateParams']>(),
          id: teacherId,
        },
        infoCreateParams: {
          ...typia.random<ITeacherSignUp['infoCreateParams']>(),
          teacherId,
        },
      };
    },
  );

  return createManyTeachers(teacherCreateDtos, db);
};
