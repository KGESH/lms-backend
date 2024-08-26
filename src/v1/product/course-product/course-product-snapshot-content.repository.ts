import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { dbSchema } from '@src/infra/db/schema';
import {
  IProductSnapshotContent,
  IProductSnapshotContentCreate,
} from '@src/v1/product/common/snapshot/content/product-snapshot-content.interface';
import * as typia from 'typia';

@Injectable()
export class CourseProductSnapshotContentRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: IProductSnapshotContentCreate,
    db = this.drizzle.db,
  ): Promise<IProductSnapshotContent> {
    const [courseProductContent] = await db
      .insert(dbSchema.courseProductSnapshotContents)
      .values(typia.misc.clone(params))
      .returning();

    return courseProductContent;
  }
}
