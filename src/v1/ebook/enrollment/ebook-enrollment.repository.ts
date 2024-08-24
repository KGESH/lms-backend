import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { and, eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import {
  IEbookEnrollment,
  IEbookEnrollmentCreate,
} from '@src/v1/ebook/enrollment/ebook-enrollment.interface';

@Injectable()
export class EbookEnrollmentRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findEbookEnrollment(
    where: Pick<IEbookEnrollment, 'userId' | 'ebookId'>,
  ): Promise<IEbookEnrollment | null> {
    const ebookEnrollment =
      await this.drizzle.db.query.ebookEnrollments.findFirst({
        where: and(
          eq(dbSchema.ebookEnrollments.userId, where.userId),
          eq(dbSchema.ebookEnrollments.ebookId, where.ebookId),
        ),
      });

    return ebookEnrollment ?? null;
  }

  async createEbookEnrollment(
    params: IEbookEnrollmentCreate,
    db = this.drizzle.db,
  ): Promise<IEbookEnrollment> {
    const [ebookEnrollment] = await db
      .insert(dbSchema.ebookEnrollments)
      .values(params)
      .returning();

    return ebookEnrollment;
  }
}
