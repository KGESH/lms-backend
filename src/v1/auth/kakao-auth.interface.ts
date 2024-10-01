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
  gender: Gender | null;
  phoneNumber: PhoneNumber;
  birthDate: BirthDate | null;
  birthdayType: BirthdayType | null;
  connectingInformation: string | null;
  duplicationInformation: string | null;
  image: string | null;
};
