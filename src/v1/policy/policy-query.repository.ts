import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import {
  IPolicy,
  IPolicyWithSnapshot,
  IPolicyWithSnapshots,
} from '@src/v1/policy/policy.interface';
import { eq } from 'drizzle-orm';
import { dbSchema } from '@src/infra/db/schema';

@Injectable()
export class PolicyQueryRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findLatestPolicies(): Promise<IPolicyWithSnapshot[]> {
    const policies = await this.drizzle.db.query.policies.findMany({
      with: {
        snapshots: {
          orderBy: (snapshot, { desc }) => desc(snapshot.createdAt),
          limit: 1,
        },
      },
    });

    return policies.map((policy) => ({
      ...policy,
      snapshot: policy.snapshots[0],
    }));
  }

  async findPolicyHistories(
    where: Pick<IPolicy, 'id'>,
  ): Promise<IPolicyWithSnapshots | null> {
    const policiesWithSnapshots =
      await this.drizzle.db.query.policies.findFirst({
        where: eq(dbSchema.policies.id, where.id),
        with: {
          snapshots: {
            orderBy: (snapshot, { desc }) => desc(snapshot.createdAt),
          },
        },
      });

    if (!policiesWithSnapshots) {
      return null;
    }

    return policiesWithSnapshots;
  }

  async findPolicy(where: Pick<IPolicy, 'id'>): Promise<IPolicy | null> {
    const policy = await this.drizzle.db.query.policies.findFirst({
      where: eq(dbSchema.policies.id, where.id),
    });

    return policy ?? null;
  }

  async findLatestPolicy(
    where: Pick<IPolicy, 'id'>,
  ): Promise<IPolicyWithSnapshot | null> {
    const policyWithSnapshot = await this.drizzle.db.query.policies.findFirst({
      where: eq(dbSchema.policies.id, where.id),
      with: {
        snapshots: {
          orderBy: (snapshot, { desc }) => desc(snapshot.createdAt),
          limit: 1,
        },
      },
    });

    if (!policyWithSnapshot?.snapshots[0]) {
      return null;
    }

    return {
      ...policyWithSnapshot,
      snapshot: policyWithSnapshot.snapshots[0],
    };
  }

  async findLatestPolicyByType(
    where: Pick<IPolicy, 'type'>,
  ): Promise<IPolicyWithSnapshot | null> {
    const policyWithSnapshot = await this.drizzle.db.query.policies.findFirst({
      where: eq(dbSchema.policies.type, where.type),
      with: {
        snapshots: {
          orderBy: (snapshot, { desc }) => desc(snapshot.createdAt),
          limit: 1,
        },
      },
    });

    if (!policyWithSnapshot?.snapshots[0]) {
      return null;
    }

    return {
      ...policyWithSnapshot,
      snapshot: policyWithSnapshot.snapshots[0],
    };
  }
}
