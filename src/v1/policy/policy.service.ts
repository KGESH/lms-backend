import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PolicyRepository } from '@src/v1/policy/policy.repository';
import { PolicySnapshotRepository } from '@src/v1/policy/policy-snapshot.repository';
import { PolicyQueryRepository } from '@src/v1/policy/policy-query.repository';
import {
  IPolicy,
  IPolicyCreate,
  IPolicySnapshot,
  IPolicySnapshotCreate,
  IPolicyUpdate,
  IPolicyWithSnapshot,
  IPolicyWithSnapshots,
} from '@src/v1/policy/policy.interface';
import { DrizzleService } from '@src/infra/db/drizzle.service';
import { UNIQUE_CONSTRAINT_ERROR_CODE } from '@src/infra/db/db.constant';

@Injectable()
export class PolicyService {
  private readonly logger = new Logger(PolicyService.name);
  constructor(
    private readonly policyRepository: PolicyRepository,
    private readonly policySnapshotRepository: PolicySnapshotRepository,
    private readonly policyQueryRepository: PolicyQueryRepository,
    private readonly drizzle: DrizzleService,
  ) {}

  async findPolicies(): Promise<IPolicyWithSnapshot[]> {
    return this.policyQueryRepository.findLatestPolicies();
  }

  async findPolicyHistoriesOrThrow(
    where: Pick<IPolicy, 'id'>,
  ): Promise<IPolicyWithSnapshots> {
    const policyHistories =
      await this.policyQueryRepository.findPolicyHistories(where);

    if (!policyHistories) {
      throw new NotFoundException('Policy not found.');
    }
    return policyHistories;
  }

  async findPolicyOrThrow(
    where: Pick<IPolicy, 'id'>,
  ): Promise<IPolicyWithSnapshot> {
    const policy = await this.policyQueryRepository.findLatestPolicy(where);

    if (!policy) {
      throw new NotFoundException('Policy not found');
    }

    return policy;
  }

  async findPolicyByTypeOrThrow(
    where: Pick<IPolicy, 'type'>,
  ): Promise<IPolicyWithSnapshot> {
    const policy =
      await this.policyQueryRepository.findLatestPolicyByType(where);

    if (!policy) {
      throw new NotFoundException('Policy not found');
    }

    return policy;
  }

  async createPolicy({
    policyParams,
    snapshotParams,
  }: {
    policyParams: IPolicyCreate;
    snapshotParams: Omit<IPolicySnapshotCreate, 'policyId'>;
  }): Promise<IPolicyWithSnapshot> {
    const alreadyExist =
      await this.policyQueryRepository.findLatestPolicyByType(policyParams);

    if (alreadyExist) {
      throw new ConflictException(
        `Policy already exist. [${policyParams.type}]`,
      );
    }

    const { policy, snapshot } = await this.drizzle.db.transaction(
      async (tx) => {
        const policy = await this.policyRepository.createPolicy(
          policyParams,
          tx,
        );
        const snapshot =
          await this.policySnapshotRepository.createPolicySnapshot(
            {
              ...snapshotParams,
              policyId: policy.id,
            },
            tx,
          );
        return { policy, snapshot };
      },
    );

    return {
      ...policy,
      snapshot,
    };
  }

  async updatePolicy({
    where,
    policyParams,
    snapshotParams,
  }: {
    where: Pick<IPolicy, 'id'>;
    policyParams: IPolicyUpdate;
    snapshotParams: Omit<IPolicySnapshotCreate, 'policyId'>;
  }): Promise<IPolicyWithSnapshot> {
    await this.findPolicyOrThrow(where);

    const { updatedPolicy, newSnapshot } = await this.drizzle.db
      .transaction(async (tx) => {
        const updatedPolicy = await this.policyRepository.updatePolicy(
          where,
          policyParams,
          tx,
        );
        const newSnapshot =
          await this.policySnapshotRepository.createPolicySnapshot(
            {
              ...snapshotParams,
              policyId: updatedPolicy.id,
            },
            tx,
          );
        return { updatedPolicy, newSnapshot };
      })
      .catch((e) => {
        this.logger.error(e);
        if (e.code === UNIQUE_CONSTRAINT_ERROR_CODE) {
          throw new ConflictException(
            `Policy type must be unique. [${policyParams.type}]`,
          );
        }

        throw new InternalServerErrorException('Failed to update policy');
      });

    return {
      ...updatedPolicy,
      snapshot: newSnapshot,
    };
  }

  async deletePolicy(where: Pick<IPolicy, 'id'>): Promise<IPolicy['id']> {
    const policy = await this.findPolicyOrThrow(where);

    const deletedPolicyId = await this.drizzle.db.transaction(async (tx) => {
      return await this.policyRepository.deletePolicy(policy, tx);
    });

    return deletedPolicyId;
  }

  async deleteLatestSnapshot(
    where: Pick<IPolicy, 'id'>,
  ): Promise<IPolicySnapshot['id']> {
    const policy = await this.findPolicyOrThrow(where);

    const deletedSnapshotId =
      await this.policySnapshotRepository.deletePolicySnapshot(policy.snapshot);

    return deletedSnapshotId;
  }
}
