import {
  EbookContentType,
  ISO8601,
  UInt,
  Uri,
  Uuid,
} from '@src/shared/types/primitive';

export type EbookContentDto = {
  id: Uuid;
  ebookId: Uuid;
  title: string;
  description: string | null;
  contentType: EbookContentType;
  url: Uri | null;
  metadata: string | null;
  sequence: UInt | null;
  createdAt: ISO8601;
  updatedAt: ISO8601;
};

export type EbookContentCreateDto = Pick<
  EbookContentDto,
  | 'ebookId'
  | 'title'
  | 'description'
  | 'contentType'
  | 'url'
  | 'metadata'
  | 'sequence'
>;
