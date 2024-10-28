import { VideoFileDto } from '@src/v1/file/file.dto';
import { ISO8601 } from '@src/shared/types/primitive';

export type MediaConvertDoneDto = Record<string, any>;

export type MediaConvertDoneNoticeDto = Pick<
  VideoFileDto,
  'id' | 'filename' | 'type' | 'metadata'
> & {
  finishedAt: ISO8601;
};
