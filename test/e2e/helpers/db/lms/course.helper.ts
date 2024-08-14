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
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import { createChapter } from './chapter.helper';
import { IChapterCreate } from '../../../../../src/v1/course/chapter/chapter.interface';

export const findCourse = async (
  where: Pick<ICourse, 'id'>,
  db: TransactionClient,
): Promise<ICourse | null> => {
  const course = await db.query.courses.findFirst({
    where: eq(dbSchema.courses.id, where.id),
  });
  return course ?? null;
};

export const createCourse = async (
  params: ICourseCreate,
  db: TransactionClient,
): Promise<ICourse> => {
  const [course] = await db.insert(dbSchema.courses).values(params).returning();

  return course;
};

export const createRandomCourse = async (db: TransactionClient) => {
  const category = await createCategory(typia.random<ICategoryCreate>(), db);
  const teacher = await createTeacher(typia.random<ITeacherSignUp>(), db);
  const course = await createCourse(
    {
      title: 'mock-course',
      categoryId: category.id,
      teacherId: teacher.id,
      description: '',
    },
    db,
  );
  const chapter = await createChapter(
    {
      ...typia.random<IChapterCreate>(),
      courseId: course.id,
    },
    db,
  );

  return { category, teacher, course, chapter };
};
