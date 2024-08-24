import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IEbook, IEbookQuery } from '@src/v1/ebook/ebook.interface';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { Pagination } from '@src/shared/types/pagination';
import { IEbookWithRelations } from '@src/v1/ebook/ebook-with-relations.interface';

@Injectable()
export class EbookQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findEbook(where: Pick<IEbook, 'id'>): Promise<IEbook | null> {
    const ebook = await this.drizzle.db.query.ebooks.findFirst({
      where: eq(dbSchema.ebooks.id, where.id),
    });

    if (!ebook) {
      return null;
    }

    return ebook;
  }

  async findEbookOrThrow(where: Pick<IEbook, 'id'>): Promise<IEbook> {
    const ebook = await this.findEbook(where);

    if (!ebook) {
      throw new NotFoundException('Ebook not found');
    }

    return ebook;
  }

  async findEbookWithRelations(
    where: Pick<IEbook, 'id'>,
  ): Promise<IEbookWithRelations | null> {
    const ebook = await this.drizzle.db.query.ebooks.findFirst({
      where: eq(dbSchema.ebooks.id, where.id),
      with: {
        category: true,
        teacher: {
          with: {
            account: true,
          },
        },
        contents: true,
      },
    });

    if (!ebook) {
      return null;
    }

    return ebook;
  }

  async findManyEbooks(params: IEbookQuery): Promise<IEbook[]> {
    const { categoryId, ...pagination } = params;
    return await this.drizzle.db.query.ebooks.findMany({
      where: categoryId
        ? eq(dbSchema.ebooks.categoryId, categoryId)
        : undefined,
      orderBy: (ebook, { asc, desc }) =>
        pagination.orderBy === 'desc'
          ? desc(ebook.createdAt)
          : asc(ebook.createdAt),
      limit: pagination.pageSize,
      offset: (pagination.page - 1) * pagination.pageSize,
    });
  }
}
