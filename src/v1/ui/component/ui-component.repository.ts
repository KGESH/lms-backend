import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';
import { IUiComponentBase } from '@src/v1/ui/component/ui-component.interface';
import { DrizzleService } from '@src/infra/db/drizzle.service';

@Injectable()
export class UiComponentRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async deleteUiComponent(
    where: Pick<IUiComponentBase, 'id'>,
    db = this.drizzle.db,
  ): Promise<IUiComponentBase['id']> {
    // Cascade delete
    await db
      .delete(dbSchema.uiComponents)
      .where(eq(dbSchema.uiComponents.id, where.id))
      .returning();
    return where.id;
  }
}
