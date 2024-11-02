import { LessonContentType, UInt, Uuid } from '@src/shared/types/primitive';
import { Optional } from '@src/shared/types/optional';
import { IFile } from '@src/v1/file/file.interface';

export type ILessonContent = {
  id: Uuid;
  lessonId: Uuid;
  fileId: Uuid | null;
  title: string;
  description: string | null;
  contentType: LessonContentType;
  metadata: string | null;
  sequence: UInt | null;
};

export type ILessonContentCreate = Pick<
  Optional<ILessonContent, 'id'>,
  | 'lessonId'
  | 'title'
  | 'description'
  | 'contentType'
  | 'fileId'
  | 'metadata'
  | 'sequence'
>;

export type ILessonContentUpdate = Omit<
  Partial<ILessonContent>,
  'id' | 'lessonId'
>;

export type ILessonContentFile = Pick<
  IFile,
  'id' | 'url' | 'filename' | 'type'
>;

export type ILessonContentWithFile = ILessonContent & {
  file: ILessonContentFile | null;
};
