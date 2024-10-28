import { EbookContentType, UInt, Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';
import { IFile } from '@src/v1/file/file.interface';

export type IEbookContent = {
  id: Uuid;
  ebookId: Uuid;
  fileId: Uuid | null;
  title: string;
  description: string | null;
  contentType: EbookContentType;
  metadata: string | null;
  sequence: UInt | null;
  createdAt: Date;
  updatedAt: Date;
};

export type IEbookContentCreate = Pick<
  Optional<IEbookContent, 'id'>,
  | 'ebookId'
  | 'title'
  | 'fileId'
  | 'description'
  | 'contentType'
  | 'metadata'
  | 'sequence'
>;

export type IEbookContentUpdate = Omit<Partial<IEbookContentCreate>, 'ebookId'>;

export type IEbookContentWithFile = IEbookContent & {
  file: Pick<IFile, 'url' | 'filename' | 'type'> | null;
};
