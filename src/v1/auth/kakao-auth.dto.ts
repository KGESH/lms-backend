import {
  BirthDate,
  BirthdayType,
  EMail,
  Gender,
  PhoneNumber,
} from '@src/shared/types/primitive';

export type KakaoLoginDto = {
  providerId: string;
  name: string;
  email: EMail;
  gender: Gender | null;
  birthDate: BirthDate | null;
  birthdayType: BirthdayType | null;
  phoneNumber: PhoneNumber;
  connectingInformation: string | null;
  duplicationInformation: string | null;
  image: string | null;
};
