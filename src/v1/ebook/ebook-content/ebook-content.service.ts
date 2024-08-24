import { Injectable } from '@nestjs/common';
import { EbookContentRepository } from '@src/v1/ebook/ebook-content/ebook-content.repository';
import {
  IEbookContent,
  IEbookContentCreate,
} from '@src/v1/ebook/ebook-content/ebook-content.interface';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { EbookContentQueryRepository } from '@src/v1/ebook/ebook-content/ebook-content-query.repository';

@Injectable()
export class EbookContentService {
  constructor(
    private readonly ebookContentRepository: EbookContentRepository,
    private readonly ebookContentQueryRepository: EbookContentQueryRepository,
  ) {}

  async createEbookContents(
    params: IEbookContentCreate[],
    tx?: TransactionClient,
  ): Promise<IEbookContent[]> {
    return await this.ebookContentRepository.createEbookContents(params, tx);
  }

  async updateEbookContent(
    where: Pick<IEbookContent, 'id'>,
    params: IEbookContentCreate,
    tx?: TransactionClient,
  ): Promise<IEbookContent> {
    await this.ebookContentQueryRepository.findEbookContentOrThrow(where);

    return await this.ebookContentRepository.updateEbookContent(
      where,
      params,
      tx,
    );
  }

  async deleteEbookContent(
    where: Pick<IEbookContent, 'id'>,
    tx?: TransactionClient,
  ): Promise<IEbookContent> {
    await this.ebookContentQueryRepository.findEbookContentOrThrow(where);

    return await this.ebookContentRepository.deleteEbookContent(where, tx);
  }
}
