import { DrizzleService } from '../../../../../src/infra/db/drizzle.service';
import { dbSchema } from '../../../../../src/infra/db/schema';
import { eq } from 'drizzle-orm';
import {
  IChapter,
  IChapterCreate,
} from '../../../../../src/v1/course/chapter/chapter.interface';

export const findChapter = async (
  where: Pick<IChapter, 'id'>,
  drizzle: DrizzleService,
): Promise<IChapter | null> => {
  const chapter = await drizzle.db.query.chapters.findFirst({
    where: eq(dbSchema.chapters.id, where.id),
  });
  return chapter ?? null;
};

export const createChapter = async (
  params: IChapterCreate,
  drizzle: DrizzleService,
): Promise<IChapter> => {
  const [chapter] = await drizzle.db
    .insert(dbSchema.chapters)
    .values(params)
    .returning();

  return chapter;
};
