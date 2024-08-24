import { Injectable } from '@nestjs/common';
import { EbookQueryRepository } from '@src/v1/ebook/ebook-query.repository';
import { IEbook, IEbookQuery } from '@src/v1/ebook/ebook.interface';

@Injectable()
export class EbookQueryService {
  constructor(private readonly ebookQueryRepository: EbookQueryRepository) {}

  async findEbooks(query: IEbookQuery): Promise<IEbook[]> {
    return await this.ebookQueryRepository.findManyEbooks(query);
  }

  async findEbookWithRelations(where: Pick<IEbook, 'id'>) {
    return await this.ebookQueryRepository.findEbookWithRelations(where);
  }
}
