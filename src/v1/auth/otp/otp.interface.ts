import { OtpUsage, Uuid } from '@src/shared/types/primitive';

export type IOtp = {
  id: Uuid;
  userId: Uuid | null;
  usage: OtpUsage;
  code: string;
  expires: Date;
  createdAt: Date;
};

export type IOtpCreate = Pick<IOtp, 'userId' | 'code' | 'usage' | 'expires'>;
