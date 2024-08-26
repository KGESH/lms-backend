import { Injectable } from '@nestjs/common';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IProductSnapshotAnnouncement,
  IProductSnapshotAnnouncementCreate,
} from '@src/v1/product/common/snapshot/announcement/product-snapshot-announcement.interface';
import * as typia from 'typia';

@Injectable()
export class CourseProductSnapshotAnnouncementRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: IProductSnapshotAnnouncementCreate,
    db = this.drizzle.db,
  ): Promise<IProductSnapshotAnnouncement> {
    const [courseProductContent] = await db
      .insert(dbSchema.courseProductSnapshotAnnouncements)
      .values(typia.misc.clone(params))
      .returning();

    return courseProductContent;
  }
}
