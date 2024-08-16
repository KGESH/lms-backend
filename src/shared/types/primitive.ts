import * as typia from 'typia';

export type Uri = string & typia.tags.Format<'uri'>;

export type Uuid = string & typia.tags.Format<'uuid'>;

export type EMail = string & typia.tags.Format<'email'>;

export type BirthDate = string & typia.tags.Format<'date'>;

export type UInt = number & typia.tags.Type<'uint32'>;

export type PhoneNumber = string; // Todo: typing

export type Gender = 'male' | 'female';

export type BirthdayType = 'SOLAR' | 'LUNAR';

export type FixedAmount = 'fixed_amount';

export type Percent = 'percent';

export type DiscountType = Percent | FixedAmount;

export type Price = `${number & typia.tags.Minimum<0>}`;

export type Percentage = `${number & typia.tags.Minimum<0>}`;

export type DiscountValue = Price | Percentage;

export type ISO8601 = string & typia.tags.Format<'date-time'>;

export type UserRole = 'user' | 'teacher' | 'manager' | 'admin';

export type AuthProvider = 'email' | 'kakao';

export type Course = 'course';

export type Ebook = 'ebook';

export type ProductType = Course | Ebook;
