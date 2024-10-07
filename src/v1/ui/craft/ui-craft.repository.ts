import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IUiCraftComponent,
  IUiCraftComponentCreate,
  IUiCraftComponentUpdate,
} from '@src/v1/ui/craft/ui-craft.interface';
import { dbSchema } from '@src/infra/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UiCraftRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createCraftUiComponent(
    params: IUiCraftComponentCreate,
    db = this.drizzle.db,
  ): Promise<IUiCraftComponent> {
    const [craftUiComponent] = await db
      .insert(dbSchema.uiCraftComponents)
      .values(params)
      .returning();

    return craftUiComponent;
  }

  async updateCraftUiComponent(
    where: Pick<IUiCraftComponent, 'id'>,
    params: IUiCraftComponentUpdate,
    db = this.drizzle.db,
  ): Promise<IUiCraftComponent> {
    const [updated] = await db
      .update(dbSchema.uiCraftComponents)
      .set(params)
      .where(eq(dbSchema.uiCraftComponents.id, where.id))
      .returning();

    return updated;
  }
}
