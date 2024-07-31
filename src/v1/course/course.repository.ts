import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { ICourse, ICourseCreate } from './course.interface';
import { asc, desc, eq, gt } from 'drizzle-orm';
import { dbSchema } from '../../infra/db/schema';
import { IRepository } from '../../core/base.repository';
import { IPagination } from '../../shared/types/pagination';
import {
  DEFAULT_CURSOR,
  DEFAULT_ORDER_BY,
  DEFAULT_PAGE_SIZE,
} from '../../core/pagination.constant';

@Injectable()
export class CourseRepository implements IRepository<ICourse> {
  constructor(private readonly drizzle: DrizzleService) {}

  async findOne(where: Pick<ICourse, 'id'>): Promise<ICourse | null> {
    const course = await this.drizzle.db.query.courses.findFirst({
      where: eq(dbSchema.courses.id, where.id),
    });

    if (!course) {
      return null;
    }

    return course;
  }

  async findOneOrThrow(where: Pick<ICourse, 'id'>): Promise<ICourse> {
    const course = await this.findOne(where);

    if (!course) {
      throw new Error('Course not found');
    }

    return course;
  }

  async findMany(
    pagination: IPagination = {
      cursor: DEFAULT_CURSOR,
      pageSize: DEFAULT_PAGE_SIZE,
      orderBy: DEFAULT_ORDER_BY,
    },
  ): Promise<ICourse[]> {
    return await this.drizzle.db
      .select()
      .from(dbSchema.courses)
      .where(
        pagination.cursor
          ? gt(dbSchema.courses.id, pagination.cursor)
          : undefined,
      )
      .limit(pagination.pageSize)
      .orderBy(
        pagination.orderBy === 'asc'
          ? asc(dbSchema.courses.id)
          : desc(dbSchema.courses.id),
      );
  }

  async create(params: ICourseCreate, db = this.drizzle.db): Promise<ICourse> {
    const [course] = await db
      .insert(dbSchema.courses)
      .values(params)
      .returning();
    return course;
  }

  async update(
    where: Pick<ICourse, 'id'>,
    params: Partial<ICourse>,
    db = this.drizzle.db,
  ): Promise<ICourse> {
    const [updated] = await db
      .update(dbSchema.courses)
      .set(params)
      .where(eq(dbSchema.courses.id, where.id))
      .returning();
    return updated;
  }

  async delete(
    where: Pick<ICourse, 'id'>,
    db = this.drizzle.db,
  ): Promise<ICourse> {
    const [deleted] = await db
      .delete(dbSchema.courses)
      .where(eq(dbSchema.courses.id, where.id))
      .returning();
    return deleted;
  }
}
