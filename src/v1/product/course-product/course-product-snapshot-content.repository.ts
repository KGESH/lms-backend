import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../../infra/db/drizzle.service';
import { dbSchema } from '../../../infra/db/schema';
import {
  IProductSnapshotContent,
  IProductSnapshotContentCreate,
} from '../common/snapshot/content/product-snapshot-content.interface';

@Injectable()
export class CourseProductSnapshotContentRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: IProductSnapshotContentCreate,
    db = this.drizzle.db,
  ): Promise<IProductSnapshotContent> {
    const [courseProductContent] = await db
      .insert(dbSchema.courseProductSnapshotContents)
      .values(params)
      .returning();

    return courseProductContent;
  }
}
