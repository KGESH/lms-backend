import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../../../../infra/db/drizzle.service';
import { dbSchema } from '../../../../../infra/db/schema';
import {
  ICourseProductSnapshotContent,
  ICourseProductSnapshotContentCreate,
} from './course-product-snapshot-content.interface';

@Injectable()
export class CourseProductSnapshotContentRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: ICourseProductSnapshotContentCreate,
    db = this.drizzle.db,
  ): Promise<ICourseProductSnapshotContent> {
    const [courseProductContent] = await db
      .insert(dbSchema.courseProductSnapshotContents)
      .values(params)
      .returning();

    return courseProductContent;
  }
}
