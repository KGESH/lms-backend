import { dbSchema } from '../../../../../src/infra/db/schema';
import { eq } from 'drizzle-orm';
import {
  IChapter,
  IChapterCreate,
} from '../../../../../src/v1/course/chapter/chapter.interface';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';

export const findChapter = async (
  where: Pick<IChapter, 'id'>,
  db: TransactionClient,
): Promise<IChapter | null> => {
  const chapter = await db.query.chapters.findFirst({
    where: eq(dbSchema.chapters.id, where.id),
  });
  return chapter ?? null;
};

export const createChapter = async (
  params: IChapterCreate,
  db: TransactionClient,
): Promise<IChapter> => {
  const [chapter] = await db
    .insert(dbSchema.chapters)
    .values(params)
    .returning();

  return chapter;
};

export const createManyChapter = async (
  params: IChapterCreate[],
  db: TransactionClient,
) => {
  const chapters = await db
    .insert(dbSchema.chapters)
    .values(params)
    .returning();

  return chapters;
};
