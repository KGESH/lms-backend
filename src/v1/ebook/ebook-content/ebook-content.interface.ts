import { EbookContentType, UInt, Uri, Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type IEbookContent = {
  id: Uuid;
  ebookId: Uuid;
  title: string;
  description: string | null;
  contentType: EbookContentType;
  url: Uri | null;
  metadata: string | null;
  sequence: UInt | null;
  createdAt: Date;
  updatedAt: Date;
};

export type IEbookContentCreate = Pick<
  Optional<IEbookContent, 'id'>,
  | 'ebookId'
  | 'title'
  | 'description'
  | 'contentType'
  | 'url'
  | 'metadata'
  | 'sequence'
>;

export type IEbookContentUpdate = Omit<Partial<IEbookContentCreate>, 'ebookId'>;
