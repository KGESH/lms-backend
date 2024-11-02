import {
  LessonContentType,
  UInt,
  Uri,
  Uuid,
} from '@src/shared/types/primitive';

export type LessonContentDto = {
  id: Uuid;
  lessonId: Uuid;
  fileId: Uuid | null;
  title: string;
  description: string | null;
  contentType: LessonContentType;
  metadata: string | null;
  sequence: UInt | null;
};

export type LessonContentWithFileDto = LessonContentDto & {
  file: {
    id: Uuid;
    url: Uri | null;
    filename: string | null;
    type: LessonContentType;
  } | null;
};

export type LessonContentCreateDto = Pick<
  LessonContentDto,
  'fileId' | 'title' | 'description' | 'contentType' | 'metadata'
>;

export type LessonContentUpdateDto = Omit<
  Partial<LessonContentDto>,
  'id' | 'lessonId'
>;
