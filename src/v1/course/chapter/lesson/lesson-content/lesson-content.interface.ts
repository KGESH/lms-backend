import { Uri, Uuid } from '../../../../../shared/types/primitive';
import { Optional } from '../../../../../shared/types/optional';

export type ILessonContent = {
  id: Uuid;
  lessonId: Uuid;
  title: string;
  description: string | null;
  contentType: string;
  url: Uri;
  metadata: string | null;
};

export type ILessonContentCreate = Pick<
  Optional<ILessonContent, 'id'>,
  'lessonId' | 'title' | 'description' | 'contentType' | 'url' | 'metadata'
>;

export type ILessonContentUpdate = Partial<ILessonContentCreate>;
