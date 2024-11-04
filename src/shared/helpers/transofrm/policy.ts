import * as date from '@src/shared/utils/date';
import {
  IPolicy,
  IPolicySnapshot,
  IPolicyWithSnapshot,
  IPolicyWithSnapshots,
} from '@src/v1/policy/policy.interface';
import {
  LatestPolicyDto,
  PolicyDto,
  PolicyHistoriesDto,
  PolicySnapshotDto,
} from '@src/v1/policy/policy.dto';

export const policyToDto = (policy: IPolicy): PolicyDto => ({
  ...policy,
  createdAt: date.toISOString(policy.createdAt),
  updatedAt: date.toISOString(policy.updatedAt),
  deletedAt: date.toIsoStringOrNull(policy.deletedAt),
});

export const policySnapshotToDto = (
  snapshot: IPolicySnapshot,
): PolicySnapshotDto => ({
  ...snapshot,
  createdAt: date.toISOString(snapshot.createdAt),
  deletedAt: date.toIsoStringOrNull(snapshot.deletedAt),
});

export const policyWithSnapshotToDto = (
  policy: IPolicyWithSnapshot,
): LatestPolicyDto => ({
  ...policyToDto(policy),
  snapshot: policySnapshotToDto(policy.snapshot),
});

export const policyHistoriesToDto = (
  policy: IPolicyWithSnapshots,
): PolicyHistoriesDto => ({
  ...policyToDto(policy),
  snapshots: policy.snapshots.map(policySnapshotToDto),
});
