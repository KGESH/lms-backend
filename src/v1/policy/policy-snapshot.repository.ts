import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IPolicySnapshot,
  IPolicySnapshotCreate,
} from '@src/v1/policy/policy.interface';
import { dbSchema } from '@src/infra/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class PolicySnapshotRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async createPolicySnapshot(
    params: IPolicySnapshotCreate,
    db = this.drizzle.db,
  ): Promise<IPolicySnapshot> {
    const [policy] = await db
      .insert(dbSchema.policySnapshots)
      .values(params)
      .returning();
    return policy;
  }

  async deletePolicySnapshot(
    where: Pick<IPolicySnapshot, 'id'>,
    db = this.drizzle.db,
  ): Promise<IPolicySnapshot['id']> {
    await db
      .delete(dbSchema.policies)
      .where(eq(dbSchema.policySnapshots.id, where.id));
    return where.id;
  }
}
