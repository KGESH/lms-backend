import { FileType, Uri, Uuid } from '@src/shared/types/primitive';

export type IFile = {
  id: Uuid;
  url: Uri;
  type: FileType;
  metadata: string | null;
  createdAt: Date;
};

export type IFileCreate = Omit<IFile, 'createdAt'>;
