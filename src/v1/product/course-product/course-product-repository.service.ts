import { Injectable, NotFoundException } from '@nestjs/common';
import { IRepository } from '../../../core/base.repository';
import { IPagination } from 'src/shared/types/pagination';
import { dbSchema } from '../../../infra/db/schema';
import {
  ICourseProduct,
  ICourseProductCreate,
} from './course-product.interface';
import { DrizzleService } from '../../../infra/db/drizzle.service';
import { asc, desc, eq } from 'drizzle-orm';

@Injectable()
export class CourseProductRepository implements IRepository<ICourseProduct> {
  constructor(private readonly drizzle: DrizzleService) {}

  async findOne(
    where: Pick<ICourseProduct, 'id'>,
  ): Promise<ICourseProduct | null> {
    const product = await this.drizzle.db.query.courseProducts.findFirst({
      where: eq(dbSchema.courseProducts.id, where.id),
    });
    return product ?? null;
  }

  async findOneOrThrow(
    where: Pick<ICourseProduct, 'id'>,
  ): Promise<ICourseProduct> {
    const product = await this.findOne(where);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findMany(pagination: IPagination): Promise<ICourseProduct[]> {
    return await this.drizzle.db.query.courseProducts.findMany({
      where: pagination.cursor
        ? eq(dbSchema.courseProducts.id, pagination.cursor)
        : undefined,
      orderBy:
        pagination.orderBy === 'asc'
          ? asc(dbSchema.courseProducts.id)
          : desc(dbSchema.courseProducts.id),
      limit: pagination.pageSize,
    });
  }

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

  async update(
    where: Pick<ICourseProduct, 'id'>,
    params: Partial<ICourseProduct>,
    db = this.drizzle.db,
  ): Promise<ICourseProduct> {
    throw new Error('Method not implemented.');
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
