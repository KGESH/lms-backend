import { OtpUsage, Uuid } from '@src/shared/types/primitive';

export type IOtp = {
  id: Uuid;
  identifier: string;
  usage: OtpUsage;
  code: string;
  expires: Date;
  createdAt: Date;
};

export type IOtpCreate = Pick<
  IOtp,
  'identifier' | 'code' | 'usage' | 'expires'
>;
