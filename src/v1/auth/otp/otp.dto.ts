import { ISO8601, OtpUsage, Uuid } from '@src/shared/types/primitive';

export type OtpDto = {
  id: Uuid;
  userId: Uuid | null;
  usage: OtpUsage;
  code: string;
  expires: ISO8601;
  createdAt: ISO8601;
};

export type CreateOtpDto = Pick<
  OtpDto,
  'code' | 'userId' | 'usage' | 'expires'
> & {
  phoneNumber: string;
};

export type SignupOtpDto = Pick<CreateOtpDto, 'phoneNumber'>;

export type VerifyOtpDto = Pick<OtpDto, 'code'>;

export type VerifyOtpResponseDto = {
  isValid: boolean;
};
