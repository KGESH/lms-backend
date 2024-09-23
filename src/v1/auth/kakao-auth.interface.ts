import {
  BirthDate,
  BirthdayType,
  EMail,
  Gender,
  PhoneNumber,
} from '@src/shared/types/primitive';

export type IKakaoLogin = {
  providerId: string;
  name: string;
  email: EMail;
  gender: Gender;
  phoneNumber: PhoneNumber;
  birthDate: BirthDate;
  birthdayType: BirthdayType;
  connectingInformation: string | null;
  duplicationInformation: string | null;
  image: string | null;
};
