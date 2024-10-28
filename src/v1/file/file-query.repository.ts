import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IFile } from '@src/v1/file/file.interface';
import { dbSchema } from '@src/infra/db/schema';
import { eq } from 'drizzle-orm';
import { assertFile } from '@src/shared/helpers/assert/file';

@Injectable()
export class FileQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findFile(where: Pick<IFile, 'id'>): Promise<IFile | null> {
    const file = await this.drizzle.db.query.files.findFirst({
      where: eq(dbSchema.files.id, where.id),
    });

    if (!file) {
      return null;
    }

    return assertFile(file);
  }
}
