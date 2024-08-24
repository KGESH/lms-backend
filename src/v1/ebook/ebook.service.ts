import { Injectable } from '@nestjs/common';
import { EbookRepository } from '@src/v1/ebook/ebook.repository';
import {
  IEbook,
  IEbookCreate,
  IEbookUpdate,
} from '@src/v1/ebook/ebook.interface';
import { TransactionClient } from '@src/infra/db/drizzle.types';
import { EbookCategoryService } from '@src/v1/ebook/category/ebook-category.service';
import { TeacherService } from '@src/v1/teacher/teacher.service';
import { EbookQueryRepository } from '@src/v1/ebook/ebook-query.repository';

@Injectable()
export class EbookService {
  constructor(
    private readonly ebookCategoryService: EbookCategoryService,
    private readonly teacherService: TeacherService,
    private readonly ebookRepository: EbookRepository,
    private readonly ebookQueryRepository: EbookQueryRepository,
  ) {}

  async createEbook(
    params: IEbookCreate,
    tx?: TransactionClient,
  ): Promise<IEbook> {
    const { teacherId, categoryId } = params;

    await this.ebookCategoryService.findEbookCategoryOrThrow({
      id: categoryId,
    });

    await this.teacherService.findTeacherOrThrow({
      id: teacherId,
    });

    return await this.ebookRepository.createEbook(params, tx);
  }

  async updateEbook(
    where: Pick<IEbook, 'id'>,
    params: IEbookUpdate,
    tx?: TransactionClient,
  ): Promise<IEbook> {
    await this.ebookQueryRepository.findEbookOrThrow({
      id: where.id,
    });

    return await this.ebookRepository.updateEbook(where, params, tx);
  }

  async deleteEbook(
    where: Pick<IEbook, 'id'>,
    tx?: TransactionClient,
  ): Promise<IEbook> {
    await this.ebookQueryRepository.findEbookOrThrow({
      id: where.id,
    });

    return await this.ebookRepository.deleteEbook(where, tx);
  }
}
