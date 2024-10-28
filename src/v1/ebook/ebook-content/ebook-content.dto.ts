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
  fileId: Uuid | null;
  title: string;
  description: string | null;
  contentType: EbookContentType;
  metadata: string | null;
  sequence: UInt | null;
  createdAt: ISO8601;
  updatedAt: ISO8601;
};

export type EbookContentWithFileDto = EbookContentDto & {
  file: {
    url: Uri | null;
    filename: string | null;
    type: EbookContentType;
  } | null;
};

export type EbookContentCreateDto = Pick<
  EbookContentDto,
  | 'ebookId'
  | 'fileId'
  | 'title'
  | 'description'
  | 'contentType'
  | 'metadata'
  | 'sequence'
>;

export type EbookContentUpdateDto = Partial<
  Omit<EbookContentCreateDto, 'ebookId'>
>;
