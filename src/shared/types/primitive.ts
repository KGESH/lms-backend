import * as typia from 'typia';

export type Uri = string & typia.tags.Format<'uri'>;

export type Uuid = string & typia.tags.Format<'uuid'>;

export type EMail = string & typia.tags.Format<'email'>;

export type BirthDate = string & typia.tags.Format<'date'>;

export type UInt = number & typia.tags.Type<'uint32'>;

export type PositiveInt = UInt & typia.tags.Minimum<1>;

export type UFloat = number & typia.tags.Type<'float'> & typia.tags.Minimum<0>;

export type PhoneNumber = string; // Todo: typing

export type Gender = 'male' | 'female';

export type BirthdayType = 'SOLAR' | 'LUNAR';

export type FixedAmount = 'fixed_amount';

export type Percent = 'percent';

export type DiscountType = Percent | FixedAmount;

export type Price = `${number}`;
// export type Price = `${number & typia.tags.Minimum<0>}`;

export type Percentage = `${number}`;
// export type Percentage = `${number & typia.tags.Minimum<0>}`;

export type DiscountValue = Price | Percentage;

export type ISO8601 = string & typia.tags.Format<'date-time'>;

export const USER_ROLE = {
  USER: 'user',
  TEACHER: 'teacher',
  MANAGER: 'manager',
  ADMIN: 'admin',
} as const;

export const CATEGORY_ACCESS_ROLE = {
  ...USER_ROLE,
  GUEST: 'guest',
  PURCHASED_USER: 'purchased_user',
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export type CategoryAccessRole =
  (typeof CATEGORY_ACCESS_ROLE)[keyof typeof CATEGORY_ACCESS_ROLE];

export type AuthProvider = 'email' | 'kakao';

export type Course = 'course';

export type Ebook = 'ebook';

export type ProductType = Course | Ebook;

export type FileType = 'video' | 'image' | 'text' | 'file';

export type PromotionContentType = FileType;

export type ProductThumbnailType = 'video' | 'image';

export type LessonContentType = FileType;

export type EbookContentType = FileType;

export type ProductUiContentType =
  | 'main_banner'
  | 'target_description'
  | 'tag'
  | 'badge';

export type CarouselContentType = 'video' | 'image';

export type TermType = 'mandatory' | 'optional';

export type PolicyType = 'terms_of_service' | 'privacy';

export type OtpUsage = 'login' | 'signup' | 'password_reset' | 'delete_account';

export type UiCraftStatus = 'draft' | 'published' | 'archived';
