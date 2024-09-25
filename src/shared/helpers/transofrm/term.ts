import {
  ISignupFormTerm,
  ISignupTerm,
  ITerm,
  ITermSnapshot,
  ITermWithSnapshot,
  IUserAgreedTerm,
  IUserTerm,
} from '@src/v1/term/term.interface';
import {
  SignupFormTermDto,
  SignupTermDto,
  TermDto,
  TermSnapshotDto,
  TermWithSnapshotDto,
  UserAgreedTermDto,
  UserTermDto,
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

export const userTermToDto = (userTerm: IUserTerm): UserTermDto => ({
  ...userTerm,
  createdAt: date.toISOString(userTerm.createdAt),
  updatedAt: date.toISOString(userTerm.updatedAt),
});

export const userAgreedTermToDto = (
  term: IUserAgreedTerm,
): UserAgreedTermDto => ({
  ...termWithSnapshotToDto(term),
  userTerm: userTermToDto(term.userTerm),
});
