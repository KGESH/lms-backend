import { ISO8601, PolicyType, Uuid } from '@src/shared/types/primitive';
import { OptionalPick } from '@src/shared/types/optional';

export type PolicyDto = {
  id: Uuid;
  name: string;
  type: PolicyType;
  description: string | null;
  createdAt: ISO8601;
  updatedAt: ISO8601;
  deletedAt: ISO8601 | null;
};

export type PolicyCreateParams = Omit<
  PolicyDto,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type PolicyUpdateParams = OptionalPick<
  PolicyDto,
  'name' | 'type' | 'description'
>;

export type PolicySnapshotDto = {
  id: Uuid;
  policyId: Uuid;
  title: string;
  description: string | null;
  content: string;
  updatedReason: string | null;
  metadata: string | null;
  createdAt: ISO8601;
  deletedAt: ISO8601 | null;
};

export type PolicySnapshotCreateParams = Omit<
  PolicySnapshotDto,
  'id' | 'policyId' | 'createdAt' | 'deletedAt'
>;

export type LatestPolicyDto = PolicyDto & {
  snapshot: PolicySnapshotDto;
};

export type PolicyHistoriesDto = PolicyDto & {
  snapshots: PolicySnapshotDto[];
};

export type CreateNewPolicyDto = {
  policy: PolicyCreateParams;
  content: PolicySnapshotCreateParams;
};

export type UpdatePolicyDto = {
  policy: PolicyUpdateParams;
  content: PolicySnapshotCreateParams;
};
