import { Uuid } from '@src/shared/types/primitive';
import { IEbookContent } from '@src/v1/ebook/ebook-content/ebook-content.interface';

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

export type IEbookContentWithHistory = IEbookContent & {
  history: IEbookContentHistory | null;
};
