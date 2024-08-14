import { dbSchema } from '../../../../../src/infra/db/schema';
import { eq } from 'drizzle-orm';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import {
  ILesson,
  ILessonCreate,
} from '../../../../../src/v1/course/chapter/lesson/lesson.interface';

export const findLesson = async (
  where: Pick<ILesson, 'id'>,
  db: TransactionClient,
): Promise<ILesson | null> => {
  const lesson = await db.query.lessons.findFirst({
    where: eq(dbSchema.lessons.id, where.id),
  });
  return lesson ?? null;
};

export const createLesson = async (
  params: ILessonCreate,
  db: TransactionClient,
): Promise<ILesson> => {
  const [lesson] = await db.insert(dbSchema.lessons).values(params).returning();
  return lesson;
};

export const createManyLesson = async (
  params: ILessonCreate[],
  db: TransactionClient,
): Promise<ILesson[]> => {
  const lessons = await db.insert(dbSchema.lessons).values(params).returning();
  return lessons;
};
