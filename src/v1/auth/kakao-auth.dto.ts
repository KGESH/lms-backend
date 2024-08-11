import {
  BirthDate,
  BirthdayType,
  EMail,
  Gender,
} from '../../shared/types/primitive';

export type KakaoLoginDto = {
  name: string;
  email: EMail;
  gender: Gender;
  birthDate: BirthDate;
  birthdayType: BirthdayType;
};
