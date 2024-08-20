import {
  LessonContentType,
  UInt,
  Uri,
  Uuid,
} from '../../../../../shared/types/primitive';
import { Optional } from '../../../../../shared/types/optional';

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
  'lessonId' | 'title' | 'description' | 'contentType' | 'url' | 'metadata'
>;

export type ILessonContentUpdate = Partial<ILessonContentCreate>;
