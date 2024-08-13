import { Injectable, NotFoundException } from '@nestjs/common';
import { IPagination } from 'src/shared/types/pagination';
import { dbSchema } from '../../../infra/db/schema';
import {
  ICourseProduct,
  ICourseProductCreate,
} from './course-product.interface';
import { DrizzleService } from '../../../infra/db/drizzle.service';
import { asc, desc, eq } from 'drizzle-orm';

@Injectable()
export class CourseProductQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findOneByCourseId({
    courseId,
  }: Pick<ICourseProduct, 'courseId'>): Promise<ICourseProduct | null> {
    const product = await this.drizzle.db.query.courseProducts.findFirst({
      where: eq(dbSchema.courseProducts.courseId, courseId),
    });

    if (!product) {
      return null;
    }

    return product;
  }
}
