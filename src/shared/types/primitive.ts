import { tags } from 'typia';

export type Uri = string & tags.Format<'uri'>;

export type Uuid = string & tags.Format<'uuid'>;

export type EMail = string & tags.Format<'email'>;

export type BirthDate = string & tags.Format<'date'>;

export type UInt = number & tags.Type<'uint32'>;

export type PhoneNumber = string; // Todo: typing

export type Gender = 'male' | 'female';

export type BirthdayType = 'SOLAR' | 'LUNAR';
