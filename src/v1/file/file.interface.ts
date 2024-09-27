import { FileType, Uri, Uuid } from '@src/shared/types/primitive';
import { RequiredPick } from '@src/shared/types/required-pick';

export type IFile = {
  id: Uuid;
  url: Uri;
  type: FileType;
  filename: string | null;
  metadata: string | null;
  createdAt: Date;
  deletedAt: Date | null;
};

export type IFileCreate = Omit<IFile, 'createdAt' | 'deletedAt'>;

export type IPreSignedUrl = RequiredPick<IFile, 'id' | 'filename' | 'url'>;

export type IPreSignedUrlCreate = Omit<IPreSignedUrl, 'url'>;
