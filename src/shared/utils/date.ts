import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

type DateType = 'date';
type IsoStrType = 'iso';
type FormattedType = 'formatted';

const displayDateFormat = 'YYYY-MM-DD HH:mm:ss';
type DisplayDateFormat = typeof displayDateFormat;

export function now(type: DateType): Date;
export function now(type: IsoStrType): string;
export function now(type: FormattedType): DisplayDateFormat;

export function now(
  type: DateType | IsoStrType | FormattedType = 'date',
): Date | string {
  switch (type) {
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

export function toISOString(date: Date): string {
  return dayjs(date).toISOString();
}
