import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import { ISO8601 } from '@src/shared/types/primitive';

dayjs.extend(utc);
dayjs.extend(timezone);

type DateInput = Date | dayjs.Dayjs | string | number;

type DateType = 'date';

type IsoStrType = 'iso';

type FormattedType = 'formatted';

const displayDateFormat = 'YYYY-MM-DD HH:mm:ss';

type DisplayDateFormat = typeof displayDateFormat;

type DateUnit = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute';

export function now(type: DateType): Date;

export function now(type: IsoStrType): string;

export function now(type: FormattedType): DisplayDateFormat;

export function now(
  output: DateType | IsoStrType | FormattedType = 'date',
): Date | string {
  switch (output) {
    case 'date':
      return dayjs().utc().toDate();
    case 'iso':
      return dayjs().utc().toISOString();
    case 'formatted':
      return dayjs().utc().format(displayDateFormat);
    default:
      throw new Error('Invalid date type');
  }
}

export function format(
  date: Date | string,
  format: DisplayDateFormat | string = displayDateFormat,
): string {
  return dayjs(date).format(format);
}

export function toDate(date: string): Date {
  return dayjs(date).toDate();
}

export function toISOString(date: Date): ISO8601 {
  return dayjs(date).toISOString();
}

export function isBefore(date: Date, compare: Date): boolean {
  return dayjs(date).isBefore(compare);
}

export function addDate(
  date: DateInput,
  value: number,
  unit: DateUnit,
  output: DateType,
): Date;

export function addDate(
  date: DateInput,
  value: number,
  unit: DateUnit,
  output: IsoStrType | FormattedType,
): string;

export function addDate(
  date: DateInput,
  value: number,
  unit: DateUnit,
  output: DateType | IsoStrType | FormattedType = 'date',
): Date | string {
  const calculatedDate = dayjs(date).add(value, unit);

  switch (output) {
    case 'date':
      return calculatedDate.toDate();
    case 'iso':
      return calculatedDate.toISOString();
    case 'formatted':
      return calculatedDate.format(displayDateFormat);
    default:
      throw new Error('Invalid date type');
  }
}

export function subtractDate(
  date: DateInput,
  value: number,
  unit: DateUnit,
  output: DateType,
): Date;

export function subtractDate(
  date: DateInput,
  value: number,
  unit: DateUnit,
  output: IsoStrType | FormattedType,
): string;

export function subtractDate(
  date: DateInput,
  value: number,
  unit: DateUnit,
  output: DateType | IsoStrType | FormattedType = 'date',
): Date | string {
  const calculatedDate = dayjs(date).subtract(value, unit);

  switch (output) {
    case 'date':
      return calculatedDate.toDate();
    case 'iso':
      return calculatedDate.toISOString();
    case 'formatted':
      return calculatedDate.format(displayDateFormat);
    default:
      throw new Error('Invalid date type');
  }
}
