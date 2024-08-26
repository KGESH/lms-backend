import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  ICourseProduct,
  ICourseProductCreate,
} from '@src/v1/product/course-product/course-product.interface';
import * as typia from 'typia';

@Injectable()
export class CourseProductRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(
    params: ICourseProductCreate,
    db = this.drizzle.db,
  ): Promise<ICourseProduct> {
    const [product] = await db
      .insert(dbSchema.courseProducts)
      .values(typia.misc.clone(params))
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
