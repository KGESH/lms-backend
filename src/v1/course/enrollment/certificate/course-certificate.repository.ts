import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  ICourseCertificate,
  ICourseCertificateCreate,
} from '@src/v1/course/enrollment/certificate/course-certificate.interface';
import { dbSchema } from '@src/infra/db/schema';

@Injectable()
export class CourseCertificateRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createCourseCertificate(
    params: ICourseCertificateCreate,
    db = this.drizzle.db,
  ): Promise<ICourseCertificate> {
    const [courseCertificate] = await db
      .insert(dbSchema.courseCertificates)
      .values(params)
      .returning();

    return courseCertificate;
  }
}
