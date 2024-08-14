import { dbSchema } from '../../../../../src/infra/db/schema';
import { eq } from 'drizzle-orm';
import {
  ITeacher,
  ITeacherSignUp,
} from '../../../../../src/v1/teacher/teacher.interface';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import { createUuid } from '../../../../../src/shared/utils/uuid';
import * as typia from 'typia';
import { createUser } from './user.helper';

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
  params: ITeacherSignUp,
  db: TransactionClient,
): Promise<ITeacher> => {
  return await db.transaction(async (tx) => {
    const { user } = await createUser(
      {
        userCreateParams: { ...params.userCreateParams, role: 'teacher' },
        accountCreateParams: params.accountCreateParams,
        infoCreateParams: params.infoCreateParams,
      },
      tx,
    );
    const [teacher] = await tx
      .insert(dbSchema.teachers)
      .values({ userId: user.id })
      .returning();

    return teacher;
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
): Promise<ITeacher[]> => {
  const teacherCreateDtos: ITeacherSignUp[] = Array.from({ length: count }).map(
    () => {
      const userId = createUuid();
      return {
        userCreateParams: {
          ...typia.random<ITeacherSignUp['userCreateParams']>(),
          id: userId,
        },
        infoCreateParams: {
          ...typia.random<ITeacherSignUp['infoCreateParams']>(),
          userId,
        },
        accountCreateParams: {
          ...typia.random<ITeacherSignUp['accountCreateParams']>(),
          userId,
        },
      };
    },
  );

  return createManyTeachers(teacherCreateDtos, db);
};
