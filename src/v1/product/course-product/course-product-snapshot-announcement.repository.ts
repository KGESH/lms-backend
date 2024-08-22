import { Injectable } from '@nestjs/common';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IProductSnapshotAnnouncement,
  IProductSnapshotAnnouncementCreate,
} from '@src/v1/product/common/snapshot/announcement/product-snapshot-announcement.interface';

@Injectable()
export class CourseProductSnapshotAnnouncementRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: IProductSnapshotAnnouncementCreate,
    db = this.drizzle.db,
  ): Promise<IProductSnapshotAnnouncement> {
    const [courseProductContent] = await db
      .insert(dbSchema.courseProductSnapshotContents)
      .values(params)
      .returning();

    return courseProductContent;
  }
}
