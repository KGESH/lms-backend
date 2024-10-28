import { IFile, IFileCreate } from '../../../../../src/v1/file/file.interface';
import { TransactionClient } from '../../../../../src/infra/db/drizzle.types';
import { dbSchema } from '../../../../../src/infra/db/schema';
import { assertFile } from '@src/shared/helpers/assert/file';

export const createManyFiles = async (
  params: IFileCreate[],
  db: TransactionClient,
): Promise<IFile[]> => {
  if (params.length === 0) {
    return [];
  }

  const files = await db.insert(dbSchema.files).values(params).returning();
  return files.map(assertFile);
};
