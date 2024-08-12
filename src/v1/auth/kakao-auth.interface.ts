import {
  BirthDate,
  BirthdayType,
  EMail,
  Gender,
  PhoneNumber,
} from '../../shared/types/primitive';

export type IKakaoLogin = {
  name: string;
  email: EMail;
  gender: Gender;
  phoneNumber: PhoneNumber;
  birthDate: BirthDate;
  birthdayType: BirthdayType;
  connectingInformation: string | null;
  duplicationInformation: string | null;
};
