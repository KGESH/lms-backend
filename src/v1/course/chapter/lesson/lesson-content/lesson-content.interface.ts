import { Uri, Uuid } from '../../../../../shared/types/primitive';

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
  ILessonContent,
  'lessonId' | 'title' | 'description' | 'contentType' | 'url' | 'metadata'
>;
