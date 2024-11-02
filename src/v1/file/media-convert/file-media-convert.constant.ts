export const MEDIA_CONVERT_STATUS = {
  PROGRESSING: 'progressing',
  DONE: 'done',
  ERROR: 'error',
} as const;

export type MediaConvertStatus =
  (typeof MEDIA_CONVERT_STATUS)[keyof typeof MEDIA_CONVERT_STATUS];

export const MEDIA_CONVERT_DONE_EVENT = 'media-convert-done';

export const SEND_MEDIA_CONVERT_DONE_EVENT = 'send-media-convert-done';
