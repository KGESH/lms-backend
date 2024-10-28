import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IEbookContent,
  IEbookContentWithFile,
} from '@src/v1/ebook/ebook-content/ebook-content.interface';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';

@Injectable()
export class EbookContentQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findEbookContent(
    where: Pick<IEbookContent, 'id'>,
  ): Promise<IEbookContent | null> {
    const ebookContent = await this.drizzle.db.query.ebookContents.findFirst({
      where: eq(dbSchema.ebookContents.id, where.id),
    });

    return ebookContent ?? null;
  }

  async findEbookContentOrThrow(
    where: Pick<IEbookContent, 'id'>,
  ): Promise<IEbookContent> {
    const ebookContent = await this.findEbookContent(where);

    if (!ebookContent) {
      throw new NotFoundException('Ebook content not found');
    }

    return ebookContent;
  }

  async findEbookContents(where: Pick<IEbookContent, 'ebookId'>) {
    return await this.drizzle.db.query.ebookContents.findMany({
      where: eq(dbSchema.ebookContents.ebookId, where.ebookId),
    });
  }

  async findEbookContentWithFile(
    where: Pick<IEbookContent, 'id'>,
  ): Promise<IEbookContentWithFile | null> {
    const ebookContentWithFile =
      await this.drizzle.db.query.ebookContents.findFirst({
        where: eq(dbSchema.ebookContents.id, where.id),
        with: {
          file: true,
        },
      });

    if (!ebookContentWithFile) {
      return null;
    }

    return ebookContentWithFile;
  }
}
