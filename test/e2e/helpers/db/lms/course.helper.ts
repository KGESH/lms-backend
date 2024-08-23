import { dbSchema } from '../../../../../src/infra/db/schema';
import { eq } from 'drizzle-orm';
import {
  ICourse,
  ICourseCreate,
} from '../../../../../src/v1/course/course.interface';
import { createCategory } from './category.helper';
import * as typia from 'typia';
import { ICategoryCreate } from '@src/v1/course/category/category.interface';
import { createTeacher } from './teacher.helper';
import { ITeacherSignUp } from '../../../../../src/v1/teacher/teacher.interface';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import { createManyChapter } from './chapter.helper';
import { IChapterCreate } from '../../../../../src/v1/course/chapter/chapter.interface';
import { createManyLesson } from './lesson.helper';
import { createManyLessonContent } from './lesson-content.helper';
import { ILessonContentCreate } from '../../../../../src/v1/course/chapter/lesson/lesson-content/lesson-content.interface';
import { ILessonCreate } from '../../../../../src/v1/course/chapter/lesson/lesson.interface';

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
  const category = await createCategory(
    {
      ...typia.random<ICategoryCreate>(),
      parentId: null,
    },
    db,
  );
  const { teacher, userSession, user } = await createTeacher(
    typia.random<ITeacherSignUp>(),
    db,
  );
  const course = await createCourse(
    {
      title: 'mock-course',
      categoryId: category.id,
      teacherId: teacher.id,
      description: '',
    },
    db,
  );
  const chapters = await createManyChapter(
    Array.from({ length: 10 }, () => ({
      ...typia.random<IChapterCreate>(),
      courseId: course.id,
    })),
    db,
  );
  const lessons = (
    await Promise.all(
      chapters.map((chapter) => {
        return createManyLesson(
          Array.from({ length: 10 }, () => ({
            ...typia.random<ILessonCreate>(),
            chapterId: chapter.id,
          })),
          db,
        );
      }),
    )
  ).flat();
  const lessonContents = (
    await Promise.all(
      lessons.map((lesson) => {
        return createManyLessonContent(
          Array.from({ length: 10 }, () => ({
            ...typia.random<ILessonContentCreate>(),
            lessonId: lesson.id,
          })),
          db,
        );
      }),
    )
  ).flat();

  return {
    category,
    teacher,
    userSession,
    user,
    course,
    chapters,
    lessons,
    lessonContents,
  };
};
