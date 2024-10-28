import { IFile } from '@src/v1/file/file.interface';
import { FileDto } from '@src/v1/file/file.dto';
import * as date from '@src/shared/utils/date';

export const fileToDto = (file: IFile): FileDto => {
  return {
    ...file,
    createdAt: date.toISOString(file.createdAt),
    updatedAt: date.toISOString(file.updatedAt),
    deletedAt: date.toIsoStringOrNull(file.deletedAt),
  };
};
