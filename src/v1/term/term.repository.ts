import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { ITerm, ITermCreate, ITermUpdate } from '@src/v1/term/term.interface';
import { dbSchema } from '@src/infra/db/schema';
import { Uuid } from '@src/shared/types/primitive';
import { eq } from 'drizzle-orm';

@Injectable()
export class TermRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createTerm(params: ITermCreate, db = this.drizzle.db): Promise<ITerm> {
    const [term] = await db.insert(dbSchema.terms).values(params).returning();
    return term;
  }

  async updateTerm(
    where: Pick<ITerm, 'id'>,
    params: ITermUpdate,
    db = this.drizzle.db,
  ): Promise<ITerm> {
    const [term] = await db
      .update(dbSchema.terms)
      .set(params)
      .where(eq(dbSchema.terms.id, where.id))
      .returning();
    return term;
  }

  async deleteTerm(
    where: Pick<ITerm, 'id'>,
    db = this.drizzle.db,
  ): Promise<ITerm['id']> {
    await db
      .delete(dbSchema.terms)
      .where(eq(dbSchema.terms.id, where.id))
      .returning();
    return where.id;
  }
}
