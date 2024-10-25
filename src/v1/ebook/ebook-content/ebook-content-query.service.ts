import { Injectable } from '@nestjs/common';
import { EbookContentQueryRepository } from '@src/v1/ebook/ebook-content/ebook-content-query.repository';
import { IEbookContent } from '@src/v1/ebook/ebook-content/ebook-content.interface';
import { IUserWithoutPassword } from '@src/v1/user/user.interface';
import {
  IEbookContentHistory,
  IEbookContentWithHistory,
} from '@src/v1/ebook/ebook-content/history/ebook-content-history.interface';
import { EbookContentHistoryQueryRepository } from '@src/v1/ebook/ebook-content/history/ebook-content-history-query.repository';
import { EbookContentHistoryRepository } from '@src/v1/ebook/ebook-content/history/ebook-content-history.repository';

@Injectable()
export class EbookContentQueryService {
  constructor(
    private readonly ebookContentQueryRepository: EbookContentQueryRepository,
    private readonly ebookContentHistoryRepository: EbookContentHistoryRepository,
    private readonly ebookContentHistoryQueryRepository: EbookContentHistoryQueryRepository,
  ) {}

  async findEbookContents(
    where: Pick<IEbookContent, 'ebookId'>,
  ): Promise<IEbookContent[]> {
    return await this.ebookContentQueryRepository.findEbookContents(where);
  }

  async findEbookContentById(
    where: Pick<IEbookContent, 'id'>,
  ): Promise<IEbookContent | null> {
    return await this.ebookContentQueryRepository.findEbookContent(where);
  }

  async getEbookContentWithHistory(
    user: IUserWithoutPassword,
    where: Pick<IEbookContentHistory, 'ebookContentId'>,
  ): Promise<IEbookContentWithHistory> {
    const ebookContent =
      await this.ebookContentQueryRepository.findEbookContentOrThrow({
        id: where.ebookContentId,
      });

    if (user.role !== 'user') {
      return {
        ...ebookContent,
        history: null,
      };
    }

    const existHistory =
      await this.ebookContentHistoryQueryRepository.findEbookContentAccessHistory(
        {
          userId: user.id,
          ebookContentId: where.ebookContentId,
        },
      );

    const history =
      existHistory ??
      (await this.ebookContentHistoryRepository.createEbookContentHistory({
        userId: user.id,
        ebookContentId: where.ebookContentId,
      }));

    return {
      ...ebookContent,
      history,
    };
  }
}
