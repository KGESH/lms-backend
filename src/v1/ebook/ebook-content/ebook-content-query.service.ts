import { Injectable } from '@nestjs/common';
import { EbookContentQueryRepository } from '@src/v1/ebook/ebook-content/ebook-content-query.repository';
import { IEbookContent } from '@src/v1/ebook/ebook-content/ebook-content.interface';

@Injectable()
export class EbookContentQueryService {
  constructor(
    private readonly ebookContentQueryRepository: EbookContentQueryRepository,
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
}
