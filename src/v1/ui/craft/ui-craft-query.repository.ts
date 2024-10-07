import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { IUiCraftComponent } from '@src/v1/ui/craft/ui-craft.interface';
import { dbSchema } from '@src/infra/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UiCraftQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findCraftUiComponent(
    where: Pick<IUiCraftComponent, 'id'>,
  ): Promise<IUiCraftComponent | null> {
    const craftUiComponent =
      await this.drizzle.db.query.uiCraftComponents.findFirst({
        where: eq(dbSchema.uiCraftComponents.id, where.id),
      });

    return craftUiComponent ?? null;
  }

  async findCraftUiComponentByPath(
    where: Pick<IUiCraftComponent, 'path'>,
  ): Promise<IUiCraftComponent | null> {
    console.log('where.path', where.path);
    const craftUiComponent =
      await this.drizzle.db.query.uiCraftComponents.findFirst({
        where: eq(dbSchema.uiCraftComponents.path, where.path),
      });

    console.log('craftUiComponent', craftUiComponent);
    return craftUiComponent ?? null;
  }
}
