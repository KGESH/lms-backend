import { FileType, Uri, Uuid } from '@src/shared/types/primitive';
import { RequiredPick } from '@src/shared/types/required-pick';
import { MediaConvertStatus } from '@src/v1/file/file.dto';

export type IFileBase = {
  id: Uuid;
  url: Uri;
  filename: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type IDefaultFile = IFileBase & {
  type: Extract<FileType, 'file'>;
  metadata: string | null;
};

export type IImageFile = IFileBase & {
  type: Extract<FileType, 'image'>;
  metadata: string | null;
};

export type IVideoFile = IFileBase & {
  type: Extract<FileType, 'video'>;
  metadata: MediaConvertStatus;
};

export type ITextFile = IFileBase & {
  type: Extract<FileType, 'text'>;
  metadata: string | null;
};

export type IFile = IDefaultFile | IImageFile | ITextFile | IVideoFile;

export type IFileCreate = Omit<IFile, 'createdAt' | 'updatedAt' | 'deletedAt'>;

export type IFileUpdate = Partial<
  Omit<IFile, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
>;

export type IPreSignedUrl = RequiredPick<IFile, 'id' | 'filename' | 'url'>;

export type IPreSignedUrlCreate = Omit<IPreSignedUrl, 'url'>;
