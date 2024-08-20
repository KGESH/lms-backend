import { Injectable } from '@nestjs/common';
import {
  IUiComponentBase,
  IUiComponentBaseCreate,
  IUiComponentBaseUpdate,
} from './ui-component.interface';
import { DrizzleService } from '../../../infra/db/drizzle.service';
import { eq } from 'drizzle-orm';
import { dbSchema } from '../../../infra/db/schema';

@Injectable()
export class UiComponentRepository {
  constructor(private readonly drizzle: DrizzleService) {}

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
