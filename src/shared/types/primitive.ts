import { tags } from 'typia';
import { Minimum } from 'typia/lib/tags';

export type Uri = string & tags.Format<'uri'>;

export type Uuid = string & tags.Format<'uuid'>;

export type EMail = string & tags.Format<'email'>;

export type BirthDate = string & tags.Format<'date'>;

export type UInt = number & tags.Type<'uint32'>;

export type PhoneNumber = string; // Todo: typing

export type Gender = 'male' | 'female';

export type BirthdayType = 'SOLAR' | 'LUNAR';

export type FixedAmount = 'fixed_amount';

export type Percent = 'percent';

export type DiscountType = Percent | FixedAmount;

export type Price = `${number & Minimum<0>}`;

export type Percentage = `${number & Minimum<0>}`;

export type DiscountValue = Price | Percentage;

export type ISO8601 = string & tags.Format<'date-time'>;

export type UserRole = 'user' | 'teacher' | 'manager' | 'admin';

export type AuthProvider = 'email' | 'kakao';
