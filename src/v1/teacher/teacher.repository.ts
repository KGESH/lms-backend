import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../../infra/db/drizzle.service';
import { asc, desc, eq } from 'drizzle-orm';
import { dbSchema } from '../../infra/db/schema';
import {
  ITeacher,
  ITeacherCreate,
  ITeacherWithAccount,
} from './teacher.interface';
import { IPagination } from '../../shared/types/pagination';
import {
  DEFAULT_CURSOR,
  DEFAULT_ORDER_BY,
  DEFAULT_PAGE_SIZE,
} from '../../core/pagination.constant';
import { IRepository } from '../../core/base.repository';
import * as typia from 'typia';
import { IUser } from '../user/user.interface';

@Injectable()
export class TeacherRepository implements IRepository<ITeacher> {
  constructor(private readonly drizzle: DrizzleService) {}

  async findOne(
    where: Pick<ITeacher, 'id'>,
  ): Promise<ITeacherWithAccount | null> {
    const teacher = await this.drizzle.db.query.teachers.findFirst({
      where: eq(dbSchema.teachers.id, where.id),
      with: {
        account: true,
      },
    });

    if (!teacher) {
      return null;
    }

    return typia.assert<ITeacherWithAccount>(teacher);
  }

  async findOneOrThrow(
    where: Pick<ITeacher, 'id'>,
  ): Promise<ITeacherWithAccount> {
    const teacher = await this.findOne(where);

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return teacher;
  }

  async findTeacherByEmail(
    where: Pick<IUser, 'email'>,
  ): Promise<ITeacherWithAccount | null> {
    const teacher = await this.drizzle.db.query.teachers.findFirst({
      where: eq(dbSchema.users.email, where.email),
      with: {
        account: true,
      },
    });

    if (!teacher) {
      return null;
    }

    return typia.assert<ITeacherWithAccount>(teacher);
  }

  async findMany(
    pagination: IPagination = {
      cursor: DEFAULT_CURSOR,
      pageSize: DEFAULT_PAGE_SIZE,
      orderBy: DEFAULT_ORDER_BY,
    },
  ): Promise<ITeacherWithAccount[]> {
    const teachers = await this.drizzle.db.query.teachers.findMany({
      with: {
        account: true,
      },
      where: pagination.cursor
        ? eq(dbSchema.teachers.id, pagination.cursor)
        : undefined,
      orderBy:
        pagination.orderBy === 'asc'
          ? asc(dbSchema.teachers.id)
          : desc(dbSchema.teachers.id),
      limit: pagination.pageSize,
    });

    return typia.assert<ITeacherWithAccount[]>(teachers);
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
