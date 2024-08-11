import {
  BirthDate,
  BirthdayType,
  EMail,
  Gender,
} from '../../shared/types/primitive';

export type IKakaoLogin = {
  name: string;
  email: EMail;
  gender: Gender;
  birthDate: BirthDate;
  birthdayType: BirthdayType;
};
