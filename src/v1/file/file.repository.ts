import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IFile, IFileCreate, IFileUpdate } from '@src/v1/file/file.interface';
import { dbSchema } from '@src/infra/db/schema';
import { eq, inArray } from 'drizzle-orm';
import * as date from '@src/shared/utils/date';
import { assertFile } from '@src/shared/helpers/assert/file';

@Injectable()
export class FileRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createManyFiles(
    params: IFileCreate[],
    db = this.drizzle.db,
  ): Promise<IFile[]> {
    const files = await db.insert(dbSchema.files).values(params).returning();

    return files.map(assertFile);
  }

  async updateFile(
    where: Pick<IFile, 'id'>,
    params: IFileUpdate,
    db = this.drizzle.db,
  ): Promise<IFile> {
    const [updated] = await db
      .update(dbSchema.files)
      .set(params)
      .where(eq(dbSchema.files.id, where.id))
      .returning();

    return assertFile(updated);
  }

  async softDeleteManyFiles(
    ids: IFile['id'][],
    db = this.drizzle.db,
  ): Promise<IFile['id'][]> {
    const deletedIds = await db
      .update(dbSchema.files)
      .set({ deletedAt: date.now('date') })
      .where(inArray(dbSchema.files.id, ids))
      .returning({ id: dbSchema.files.id });

    if (deletedIds.length !== ids.length) {
      throw new NotFoundException(
        'File count does not match the number of deleted files',
      );
    }

    return ids;
  }

  async deleteManyFiles(
    ids: IFile['id'][],
    db = this.drizzle.db,
  ): Promise<IFile['id'][]> {
    await db.delete(dbSchema.files).where(inArray(dbSchema.files.id, ids));

    return ids;
  }
}
