import * as typia from 'typia';
import { dbSchema } from '../../../../../src/infra/db/schema';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import { createEbookCategory } from './ebook-category.helper';
import { IEbookCategoryCreate } from '../../../../../src/v1/ebook/category/ebook-category.interface';
import { createTeacher } from './teacher.helper';
import { ITeacherSignUp } from '../../../../../src/v1/teacher/teacher.interface';
import {
  IEbook,
  IEbookCreate,
} from '../../../../../src/v1/ebook/ebook.interface';
import {
  IEbookContent,
  IEbookContentCreate,
} from '../../../../../src/v1/ebook/ebook-content/ebook-content.interface';
import { eq } from 'drizzle-orm';

export const findEbook = async (where: Pick<IEbook, 'id'>, db: TransactionClient) => {
  const ebook = await db.query.ebooks.findFirst({
    where: eq(dbSchema.ebooks.id, where.id),
  });

  if (!ebook) {
    return null;
  }

  return ebook;
};

export const createEbook = async (
  params: IEbookCreate,
  db: TransactionClient,
) => {
  const [ebook] = await db.insert(dbSchema.ebooks).values(params).returning();
  return ebook;
};

export const createManyEbookContents = async (
  params: IEbookContentCreate[],
  db: TransactionClient,
): Promise<IEbookContent[]> => {
  const ebookContents = await db
    .insert(dbSchema.ebookContents)
    .values(params)
    .returning();
  return ebookContents;
};

export const createRandomEbook = async (db: TransactionClient) => {
  const category = await createEbookCategory(
    {
      ...typia.random<IEbookCategoryCreate>(),
      parentId: null,
    },
    db,
  );
  const { teacher, userSession, user } = await createTeacher(
    typia.random<ITeacherSignUp>(),
    db,
  );
  const ebook = await createEbook(
    {
      title: 'mock ebook',
      categoryId: category.id,
      teacherId: teacher.id,
      description: 'mock ebook description',
    },
    db,
  );
  const ebookContents = await createManyEbookContents(
    Array.from({ length: 5 }, () => ({
      ...typia.random<IEbookContentCreate>(),
      ebookId: ebook.id,
    })),
    db,
  );

  return {
    category,
    teacher,
    userSession,
    user,
    ebook,
    ebookContents,
  };
};

export const seedEbooks = async (
  { count }: { count: number },
  db: TransactionClient,
) => {
  return await Promise.all(
    Array.from({ length: count }).map(() => createRandomEbook(db)),
  );
};
