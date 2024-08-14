import { dbSchema } from '../../../../../src/infra/db/schema';
import { eq } from 'drizzle-orm';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import {
  ILessonContent,
  ILessonContentCreate,
} from '../../../../../src/v1/course/chapter/lesson/lesson-content/lesson-content.interface';

export const findLessonContent = async (
  where: Pick<ILessonContent, 'id'>,
  db: TransactionClient,
): Promise<ILessonContent | null> => {
  const lesson = await db.query.lessonContents.findFirst({
    where: eq(dbSchema.lessonContents.id, where.id),
  });
  return lesson ?? null;
};

export const createLessonContent = async (
  params: ILessonContentCreate,
  db: TransactionClient,
): Promise<ILessonContent> => {
  const [lessonContent] = await db
    .insert(dbSchema.lessonContents)
    .values(params)
    .returning();

  return lessonContent;
};

export const createManyLessonContent = async (
  params: ILessonContentCreate[],
  db: TransactionClient,
): Promise<ILessonContent[]> => {
  const lessonContents = await db
    .insert(dbSchema.lessonContents)
    .values(params)
    .returning();
  return lessonContents;
};
