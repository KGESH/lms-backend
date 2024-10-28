import {
  LessonContentType,
  UInt,
  Uri,
  Uuid,
} from '@src/shared/types/primitive';

export type LessonContentDto = {
  id: Uuid;
  lessonId: Uuid;
  title: string;
  description: string | null;
  contentType: LessonContentType;
  metadata: string | null;
  sequence: UInt | null;
};

export type LessonContentWithFileDto = LessonContentDto & {
  file: {
    url: Uri | null;
    filename: string | null;
    type: LessonContentType;
  } | null;
};

export type LessonContentCreateDto = Pick<
  LessonContentDto,
  'title' | 'description' | 'contentType' | 'metadata'
> & {
  fileId: Uuid | null;
};

export type LessonContentUpdateDto = Omit<
  Partial<LessonContentDto>,
  'id' | 'lessonId'
>;
