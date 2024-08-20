import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../../infra/db/drizzle.service';
import { dbSchema } from '../../../infra/db/schema';
import {
  IProductSnapshotAnnouncement,
  IProductSnapshotAnnouncementCreate,
} from '../common/snapshot/announcement/product-snapshot-announcement.interface';

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
