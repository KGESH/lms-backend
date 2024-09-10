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
  url: Uri | null;
  metadata: string | null;
  sequence: UInt | null;
};

export type LessonContentCreateDto = Pick<
  LessonContentDto,
  'title' | 'description' | 'contentType' | 'url' | 'metadata'
>;

export type LessonContentUpdateDto = Omit<
  Partial<LessonContentDto>,
  'id' | 'lessonId'
>;
