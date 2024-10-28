import * as typia from 'typia';
import { IFile } from '@src/v1/file/file.interface';
import { dbSchema } from '@src/infra/db/schema';

export const assertFile = (file: typeof dbSchema.files.$inferSelect) =>
  typia.assert<IFile>(file);
