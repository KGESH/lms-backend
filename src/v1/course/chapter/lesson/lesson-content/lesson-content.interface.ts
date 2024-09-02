import {
  LessonContentType,
  UInt,
  Uri,
  Uuid,
} from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';

export type ILessonContent = {
  id: Uuid;
  lessonId: Uuid;
  title: string;
  description: string | null;
  contentType: LessonContentType;
  url: Uri | null;
  metadata: string | null;
  sequence: UInt | null;
};

export type ILessonContentCreate = Pick<
  Optional<ILessonContent, 'id'>,
  | 'lessonId'
  | 'title'
  | 'description'
  | 'contentType'
  | 'url'
  | 'metadata'
  | 'sequence'
>;

export type ILessonContentUpdate = Omit<
  Partial<ILessonContent>,
  'id' | 'lessonId'
>;
