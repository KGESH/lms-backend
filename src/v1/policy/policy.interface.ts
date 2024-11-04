import { PolicyType, Uuid } from '@src/shared/types/primitive';
import { OptionalPick } from '@src/shared/types/optional';

export type IPolicy = {
  id: Uuid;
  name: string;
  type: PolicyType;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type IPolicyCreate = Omit<
  IPolicy,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type IPolicyUpdate = OptionalPick<
  IPolicy,
  'name' | 'type' | 'description'
>;

export type IPolicySnapshot = {
  id: Uuid;
  policyId: Uuid;
  title: string;
  description: string | null;
  content: string;
  updatedReason: string | null;
  metadata: string | null;
  createdAt: Date;
  deletedAt: Date | null;
};

export type IPolicySnapshotCreate = Omit<
  IPolicySnapshot,
  'id' | 'createdAt' | 'deletedAt'
>;

export type IPolicyWithSnapshot = IPolicy & {
  snapshot: IPolicySnapshot;
};

export type IPolicyWithSnapshots = IPolicy & {
  snapshots: IPolicySnapshot[];
};
