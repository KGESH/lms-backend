import { DrizzleService } from '../../../../../src/infra/db/drizzle.service';
import { dbSchema } from '../../../../../src/infra/db/schema';
import { eq } from 'drizzle-orm';
import {
  ICourse,
  ICourseCreate,
} from '../../../../../src/v1/course/course.interface';
import { createCategory } from './category.helper';
import * as typia from 'typia';
import { ICategoryCreate } from '../../../../../src/v1/category/category.interface';
import { createTeacher } from './teacher.helper';
import { ITeacherSignUp } from '../../../../../src/v1/teacher/teacher.interface';

export const findCourse = async (
  where: Pick<ICourse, 'id'>,
  drizzle: DrizzleService,
): Promise<ICourse | null> => {
  const course = await drizzle.db.query.courses.findFirst({
    where: eq(dbSchema.courses.id, where.id),
  });
  return course ?? null;
};

export const createCourse = async (
  params: ICourseCreate,
  drizzle: DrizzleService,
): Promise<ICourse> => {
  const [course] = await drizzle.db
    .insert(dbSchema.courses)
    .values(params)
    .returning();

  return course;
};

export const createRandomCourse = async (drizzle: DrizzleService) => {
  const category = await createCategory(
    typia.random<ICategoryCreate>(),
    drizzle,
  );
  const { teacher } = await createTeacher(
    typia.random<ITeacherSignUp>(),
    drizzle,
  );
  const course = await createCourse(
    {
      title: 'mock-course',
      categoryId: category.id,
      teacherId: teacher.id,
      description: '',
    },
    drizzle,
  );

  return { category, teacher, course };
};
