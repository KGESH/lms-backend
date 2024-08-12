import { DrizzleService } from '../../../../../src/infra/db/drizzle.service';
import { dbSchema } from '../../../../../src/infra/db/schema';
import { eq } from 'drizzle-orm';
import {
  ITeacher,
  ITeacherInfo,
  ITeacherSignUp,
} from '../../../../../src/v1/teacher/teacher.interface';

export const findTeacher = async (
  where: Pick<ITeacher, 'id'>,
  drizzle: DrizzleService,
): Promise<ITeacher | null> => {
  const course = await drizzle.db.query.teachers.findFirst({
    where: eq(dbSchema.teachers.id, where.id),
  });
  return course ?? null;
};

export const createTeacher = async (
  { teacherCreateParams, infoCreateParams }: ITeacherSignUp,
  drizzle: DrizzleService,
): Promise<{
  teacher: ITeacher;
  teacherInfo: ITeacherInfo;
}> => {
  return await drizzle.db.transaction(async (tx) => {
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
