import { Uuid } from '@src/shared/types/primitive';
import { IEbookContentWithFile } from '@src/v1/ebook/ebook-content/ebook-content.interface';

export type IEbookContentHistory = {
  id: Uuid;
  userId: Uuid;
  ebookContentId: Uuid;
  createdAt: Date;
};

export type IEbookContentHistoryCreate = Pick<
  IEbookContentHistory,
  'userId' | 'ebookContentId'
>;

export type IEbookContentWithHistory = IEbookContentWithFile & {
  history: IEbookContentHistory | null;
};
