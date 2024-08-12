import { Uri, Uuid } from '../../../../../shared/types/primitive';

export type LessonContentDto = {
  id: Uuid;
  lessonId: Uuid;
  title: string;
  description: string | null;
  contentType: string;
  url: Uri;
  metadata: string | null;
};

export type LessonContentCreateDto = Pick<
  LessonContentDto,
  'title' | 'description' | 'contentType' | 'url' | 'metadata'
>;

export type LessonContentUpdateDto = Partial<LessonContentDto>;
