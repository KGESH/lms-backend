import * as date from '@src/shared/utils/date';
import { IEbookContent } from '@src/v1/ebook/ebook-content/ebook-content.interface';
import { EbookContentDto } from '@src/v1/ebook/ebook-content/ebook-content.dto';
import { IEbookContentWithHistory } from '@src/v1/ebook/ebook-content/history/ebook-content-history.interface';
import { EbookContentWithHistoryDto } from '@src/v1/ebook/ebook-content/history/ebook-content-history.dto';

export const ebookContentToDto = (
  ebookContent: IEbookContent,
): EbookContentDto => {
  return {
    ...ebookContent,
    createdAt: date.toISOString(ebookContent.createdAt),
    updatedAt: date.toISOString(ebookContent.updatedAt),
  };
};

export const ebookContentWithHistoryToDto = (
  ebookContentWithHistory: IEbookContentWithHistory,
): EbookContentWithHistoryDto | null => ({
  ...ebookContentToDto(ebookContentWithHistory),
  history: ebookContentWithHistory.history
    ? {
        ...ebookContentWithHistory.history,
        createdAt: date.toISOString(ebookContentWithHistory.history.createdAt),
      }
    : null,
});
