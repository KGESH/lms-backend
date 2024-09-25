import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IFile, IFileCreate } from '@src/v1/file/file.interface';
import { dbSchema } from '@src/infra/db/schema';
import { inArray } from 'drizzle-orm';

@Injectable()
export class FileRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createManyFiles(
    params: IFileCreate[],
    db = this.drizzle.db,
  ): Promise<IFile[]> {
    const files = await db.insert(dbSchema.files).values(params).returning();

    return files;
  }

  async deleteManyFiles(
    ids: IFile['id'][],
    db = this.drizzle.db,
  ): Promise<IFile['id'][]> {
    await db.delete(dbSchema.files).where(inArray(dbSchema.files.id, ids));

    return ids;
  }
}
