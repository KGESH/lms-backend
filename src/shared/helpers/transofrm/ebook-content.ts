import * as date from '@src/shared/utils/date';
import { IEbookContent } from '@src/v1/ebook/ebook-content/ebook-content.interface';
import { EbookContentDto } from '@src/v1/ebook/ebook-content/ebook-content.dto';

export const ebookContentToDto = (
  ebookContent: IEbookContent,
): EbookContentDto => {
  return {
    ...ebookContent,
    createdAt: date.toISOString(ebookContent.createdAt),
    updatedAt: date.toISOString(ebookContent.updatedAt),
  };
};
