import { ISO8601, TermType, UInt, Uuid } from '@src/shared/types/primitive';
import { OptionalPick } from '@src/shared/types/optional';

export type TermDto = {
  id: Uuid;
  name: string;
  type: TermType;
  createdAt: ISO8601;
  updatedAt: ISO8601;
  deletedAt: ISO8601 | null;
};

export type CreateTermDto = Omit<
  TermDto,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type UpdateTermDto = OptionalPick<TermDto, 'name' | 'type'>;

export type TermSnapshotDto = {
  id: Uuid;
  termId: Uuid;
  title: string;
  description: string | null;
  content: string;
  updatedReason: string | null;
  metadata: string | null;
  createdAt: ISO8601;
};

export type CreateTermSnapshotDto = Omit<
  TermSnapshotDto,
  'id' | 'termId' | 'createdAt' | 'updatedReason'
>;

export type CreateTermWithSnapshotDto = CreateTermDto & {
  snapshot: CreateTermSnapshotDto;
};

export type UpdateTermContentDto = OptionalPick<
  TermSnapshotDto,
  'title' | 'description' | 'content' | 'updatedReason' | 'metadata'
>;

export type UpdateTermWithContentDto = {
  termUpdateParams?: UpdateTermDto;
  termContentUpdateParams?: UpdateTermContentDto;
};

export type SignupTermDto = {
  id: Uuid;
  termId: Uuid;
  sequence: UInt;
  createdAt: ISO8601;
};

export type CreateSignupTermDto = Omit<SignupTermDto, 'id' | 'createdAt'>;

export type UserTermDto = {
  id: Uuid;
  userId: Uuid;
  termId: Uuid;
  agreed: boolean;
  createdAt: ISO8601;
  updatedAt: ISO8601;
};

export type CreateUserTermDto = Omit<
  UserTermDto,
  'id' | 'createdAt' | 'updatedAt'
>;

export type TermWithSnapshotDto = TermDto & {
  snapshot: TermSnapshotDto;
};

export type SignupFormTermDto = TermWithSnapshotDto & {
  signupTerm: SignupTermDto;
};

export type UserAgreedTermDto = TermWithSnapshotDto & {
  userTerm: UserTermDto;
};
