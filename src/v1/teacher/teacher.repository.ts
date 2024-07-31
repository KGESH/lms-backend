import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { asc, desc, eq, gt } from 'drizzle-orm';
import { dbSchema } from '../../infra/db/schema';
import { ITeacher, ITeacherCreate } from './teacher.interface';
import { IPagination } from '../../shared/types/pagination';
import {
  DEFAULT_CURSOR,
  DEFAULT_ORDER_BY,
  DEFAULT_PAGE_SIZE,
} from '../../core/pagination.constant';
import { IRepository } from '../../core/base.repository';

@Injectable()
export class TeacherRepository implements IRepository<ITeacher> {
  constructor(private readonly drizzle: DrizzleService) {}

  async findOne(where: Pick<ITeacher, 'id'>): Promise<ITeacher | null> {
    const teacher = await this.drizzle.db.query.teachers.findFirst({
      where: eq(dbSchema.teachers.id, where.id),
    });

    if (!teacher) {
      return null;
    }

    return teacher;
  }

  async findOneOrThrow(where: Pick<ITeacher, 'id'>): Promise<ITeacher> {
    const teacher = await this.findOne(where);

    if (!teacher) {
      throw new Error('Teacher not found');
    }

    return teacher;
  }

  async findTeacherByEmail(
    where: Pick<ITeacher, 'email'>,
  ): Promise<ITeacher | null> {
    const teacher = await this.drizzle.db.query.teachers.findFirst({
      where: eq(dbSchema.teachers.email, where.email),
    });

    if (!teacher) {
      return null;
    }

    return teacher;
  }

  async findMany(
    pagination: IPagination = {
      cursor: DEFAULT_CURSOR,
      pageSize: DEFAULT_PAGE_SIZE,
      orderBy: DEFAULT_ORDER_BY,
    },
  ): Promise<ITeacher[]> {
    return await this.drizzle.db
      .select()
      .from(dbSchema.teachers)
      .where(
        pagination.cursor
          ? gt(dbSchema.teachers.id, pagination.cursor)
          : undefined,
      )
      .limit(pagination.pageSize)
      .orderBy(
        pagination.orderBy === 'asc'
          ? asc(dbSchema.teachers.id)
          : desc(dbSchema.teachers.id),
      );
  }

  async create(
    params: ITeacherCreate,
    db = this.drizzle.db,
  ): Promise<ITeacher> {
    const [teacher] = await db
      .insert(dbSchema.teachers)
      .values(params)
      .returning();
    return teacher;
  }

  async update(
    where: Pick<ITeacher, 'id'>,
    params: Partial<ITeacher>,
    db = this.drizzle.db,
  ): Promise<ITeacher> {
    const [updated] = await db
      .update(dbSchema.teachers)
      .set(params)
      .where(eq(dbSchema.teachers.id, where.id))
      .returning();
    return updated;
  }

  async delete(
    where: Pick<ITeacher, 'id'>,
    db = this.drizzle.db,
  ): Promise<ITeacher> {
    const [deleted] = await db
      .delete(dbSchema.teachers)
      .where(eq(dbSchema.teachers.id, where.id))
      .returning();
    return deleted;
  }
}
