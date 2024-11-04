import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IPolicy,
  IPolicyCreate,
  IPolicyUpdate,
} from '@src/v1/policy/policy.interface';
import { dbSchema } from '@src/infra/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class PolicyRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createPolicy(
    params: IPolicyCreate,
    db = this.drizzle.db,
  ): Promise<IPolicy> {
    const [policy] = await db
      .insert(dbSchema.policies)
      .values(params)
      .returning();
    return policy;
  }

  async updatePolicy(
    where: Pick<IPolicy, 'id'>,
    params: IPolicyUpdate,
    db = this.drizzle.db,
  ): Promise<IPolicy> {
    const [updated] = await db
      .update(dbSchema.policies)
      .set(params)
      .where(eq(dbSchema.policies.id, where.id))
      .returning();
    return updated;
  }

  async deletePolicy(
    where: Pick<IPolicy, 'id'>,
    db = this.drizzle.db,
  ): Promise<IPolicy['id']> {
    await db
      .delete(dbSchema.policies)
      .where(eq(dbSchema.policies.id, where.id));
    return where.id;
  }
}
