import {
  BirthDate,
  BirthdayType,
  EMail,
  Gender,
  PhoneNumber,
} from '@src/shared/types/primitive';

export type KakaoLoginDto = {
  name: string;
  email: EMail;
  gender: Gender;
  birthDate: BirthDate;
  birthdayType: BirthdayType;
  phoneNumber: PhoneNumber;
  connectingInformation: string | null;
  duplicationInformation: string | null;
};
