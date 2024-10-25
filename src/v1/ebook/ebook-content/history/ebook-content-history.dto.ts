import { ISO8601, Uuid } from '@src/shared/types/primitive';
import { EbookContentDto } from '@src/v1/ebook/ebook-content/ebook-content.dto';

export type EbookContentHistoryDto = {
  id: Uuid;
  userId: Uuid;
  ebookContentId: Uuid;
  createdAt: ISO8601;
};

export type EbookContentWithHistoryDto = EbookContentDto & {
  history: EbookContentHistoryDto | null;
};
