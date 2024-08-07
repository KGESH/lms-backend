import { Injectable, NotFoundException } from '@nestjs/common';
import { IRepository } from '../../../core/base.repository';
import {
  IUiComponentBase,
  IUiComponentBaseCreate,
  IUiComponentBaseUpdate,
} from './ui-component.interface';
import { IPagination } from 'src/shared/types/pagination';
import { DrizzleService } from '../../../infra/db/drizzle.service';
import { asc, desc, eq } from 'drizzle-orm';
import { dbSchema } from '../../../infra/db/schema';

@Injectable()
export class UiComponentRepository implements IRepository<IUiComponentBase> {
  constructor(private readonly drizzle: DrizzleService) {}

  async findOne(
    where: Pick<IUiComponentBase, 'id'>,
  ): Promise<IUiComponentBase | null> {
    const uiComponent = await this.drizzle.db.query.uiComponents.findFirst({
      where: eq(dbSchema.uiComponents.id, where.id),
    });

    if (!uiComponent) {
      return null;
    }

    return uiComponent;
  }

  async findOneOrThrow(
    where: Pick<IUiComponentBase, 'id'>,
  ): Promise<IUiComponentBase> {
    const uiComponent = await this.findOne(where);

    if (!uiComponent) {
      throw new NotFoundException('UI component not found');
    }

    return uiComponent;
  }

  findMany(pagination: IPagination): Promise<IUiComponentBase[]> {
    const uiComponents = this.drizzle.db
      .select()
      .from(dbSchema.uiComponents)
      .where(
        pagination.cursor
          ? eq(dbSchema.uiComponents.id, pagination.cursor)
          : undefined,
      )
      .limit(pagination.pageSize)
      .orderBy(
        pagination.orderBy === 'asc'
          ? asc(dbSchema.uiComponents.id)
          : desc(dbSchema.uiComponents.id),
      );
    return uiComponents;
  }

  async create(
    params: IUiComponentBaseCreate,
    db = this.drizzle.db,
  ): Promise<IUiComponentBase> {
    const [uiComponent] = await db
      .insert(dbSchema.uiComponents)
      .values(params)
      .returning();
    return uiComponent;
  }

  async update(
    where: Pick<IUiComponentBase, 'id'>,
    params: IUiComponentBaseUpdate,
    db = this.drizzle.db,
  ): Promise<IUiComponentBase> {
    const [updated] = await db
      .update(dbSchema.uiComponents)
      .set(params)
      .where(eq(dbSchema.uiComponents.id, where.id))
      .returning();
    return updated;
  }

  async delete(
    where: Pick<IUiComponentBase, 'id'>,
    db = this.drizzle.db,
  ): Promise<IUiComponentBase> {
    // Cascade delete
    const [uiComponent] = await db
      .delete(dbSchema.uiComponents)
      .where(eq(dbSchema.uiComponents.id, where.id))
      .returning();
    return uiComponent;
  }
}
