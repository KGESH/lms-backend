import { Injectable } from '@nestjs/common';
import { dbSchema } from '../../../infra/db/schema';
import {
  ICourseProduct,
  ICourseProductCreate,
} from './course-product.interface';
import { DrizzleService } from '../../../infra/db/drizzle.service';
import { eq } from 'drizzle-orm';

@Injectable()
export class CourseProductRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: ICourseProductCreate,
    db = this.drizzle.db,
  ): Promise<ICourseProduct> {
    const [product] = await db
      .insert(dbSchema.courseProducts)
      .values(params)
      .returning();
    return product;
  }

  // Cascade delete
  async delete(
    where: Pick<ICourseProduct, 'id'>,
    db = this.drizzle.db,
  ): Promise<ICourseProduct> {
    const [deleted] = await db
      .delete(dbSchema.courseProducts)
      .where(eq(dbSchema.courseProducts.id, where.id))
      .returning();
    return deleted;
  }
}
