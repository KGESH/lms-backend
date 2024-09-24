import { TermType, UInt, Uuid } from '@src/shared/types/primitive';
import { OptionalPick } from '@src/shared/types/optional';

export type ITerm = {
  id: Uuid;
  name: string;
  type: TermType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type ITermCreate = Omit<
  ITerm,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type ITermUpdate = OptionalPick<ITerm, 'name' | 'type'>;

export type ITermSnapshot = {
  id: Uuid;
  termId: Uuid;
  title: string;
  description: string | null;
  content: string;
  updatedReason: string | null;
  metadata: string | null;
  createdAt: Date;
};

export type ITermSnapshotCreate = Omit<ITermSnapshot, 'id' | 'createdAt'>;

export type ITermContentUpdate = Omit<Partial<ITermSnapshotCreate>, 'termId'>;

export type ISignupTerm = {
  id: Uuid;
  termId: Uuid;
  sequence: UInt;
  createdAt: Date;
};

export type ISignupTermCreate = Omit<ISignupTerm, 'id' | 'createdAt'>;

export type IUserTerm = {
  id: Uuid;
  userId: Uuid;
  termId: Uuid;
  agreed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type IUserTermCreate = Omit<IUserTerm, 'id' | 'createdAt' | 'updatedAt'>;

export type ITermWithSnapshot = ITerm & {
  snapshot: ITermSnapshot;
};

export type ISignupFormTerm = ITermWithSnapshot & {
  signupTerm: ISignupTerm;
};

export type IUserAgreedTerm = ITermWithSnapshot & {
  userTerm: IUserTerm;
};
