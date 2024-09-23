import {
  ISignupFormTerm,
  ISignupTerm,
  ITerm,
  ITermSnapshot,
  ITermWithSnapshot,
} from '@src/v1/term/term.interface';
import {
  SignupFormTermDto,
  SignupTermDto,
  TermDto,
  TermSnapshotDto,
  TermWithSnapshotDto,
} from '@src/v1/term/term.dto';
import * as date from '@src/shared/utils/date';

export const termToDto = (term: ITerm): TermDto => ({
  ...term,
  createdAt: date.toISOString(term.createdAt),
  updatedAt: date.toISOString(term.updatedAt),
  deletedAt: term.deletedAt ? date.toISOString(term.deletedAt) : null,
});

export const termSnapshotToDto = (
  snapshot: ITermSnapshot,
): TermSnapshotDto => ({
  ...snapshot,
  createdAt: date.toISOString(snapshot.createdAt),
});

export const SignupTermToDto = (signupTerm: ISignupTerm): SignupTermDto => ({
  ...signupTerm,
  createdAt: date.toISOString(signupTerm.createdAt),
});

export const termWithSnapshotToDto = (
  termRelations: ITermWithSnapshot,
): TermWithSnapshotDto => ({
  ...termToDto(termRelations),
  snapshot: termSnapshotToDto(termRelations.snapshot),
});

export const signupFormTermToDto = (
  termRelations: ISignupFormTerm,
): SignupFormTermDto => ({
  ...termWithSnapshotToDto(termRelations),
  signupTerm: SignupTermToDto(termRelations.signupTerm),
});
